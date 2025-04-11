package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.model.prediccion;

import weka.classifiers.Classifier;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

@RequestMapping("/api/prediccion")
@RestController
public class PrediccionController {

    private Classifier clasificador;
    private Instances estructura;

    public PrediccionController() {
        try {
            // Cargar modelo
            try (ObjectInputStream ois = new ObjectInputStream(
                    getClass().getClassLoader().getResourceAsStream("weka/modelo_empleo_j48.model"))) {
                clasificador = (Classifier) ois.readObject();
            }

            // Cargar estructura ARFF desde recursos
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("weka/empleo_recomendacion_simplificado_balanceado.arff");
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            estructura = new Instances(reader);
            estructura.setClassIndex(estructura.numAttributes() - 1);

        } catch (IOException | ClassNotFoundException e) {

        }
    }

    @PostMapping("/prediccion")
    public ResponseEntity<?> predecir(@RequestBody prediccion datos) {
        try {
            // Crear nueva instancia sin valores faltantes
            Instance instancia = new DenseInstance(estructura.numAttributes());
            instancia.setDataset(estructura);

            // Asignar valores uno a uno (orden como en el .arff)
            instancia.setValue(0, datos.getTipoEmpleoOferta());
            instancia.setValue(1, datos.getModalidadOferta());
            instancia.setValue(2, datos.getTipoContratoOferta());
            instancia.setValue(3, datos.getExperienciaRequerida());
            instancia.setValue(4, datos.getNivelEstudioRequerido());
            instancia.setValue(5, datos.getSectorOferta());
            instancia.setValue(6, datos.getTipoEmpleoDeseado());
            instancia.setValue(7, datos.getPreferenciaModalidad());
            instancia.setValue(8, datos.getPreferenciaContrato());
            instancia.setValue(9, datos.getExperienciaPersona());
            instancia.setValue(10, datos.getNivelEstudioPersona());
            instancia.setValue(11, datos.getSectorPersona());
            instancia.setValue(12, datos.getEdadPersona());
            instancia.setValue(13, datos.getCoincideTipoEmpleo());
            instancia.setValue(14, datos.getCoincideModalidad());
            instancia.setValue(15, datos.getCoincideContrato());
            instancia.setValue(16, datos.getCoincideEstudios());
            instancia.setValue(17, datos.getCoincideSector());
            instancia.setValue(18, datos.getExperienciaSuficiente());
            // Posición 19 es la clase

            // Predecir clase
            double clase = clasificador.classifyInstance(instancia);
            String valorClase = estructura.classAttribute().value((int) clase);

            // Distribución original
            double[] distribucion = clasificador.distributionForInstance(instancia);
            double porcentajeBase = distribucion[(int) clase] * 100.0;
            System.out.println("Distribución: " + Arrays.toString(distribucion));

            // Ajustar el porcentaje basándonos en campos importantes
            double ajuste = 0.0;

            // Experiencia
            double diferenciaExperiencia = datos.getExperienciaPersona() - datos.getExperienciaRequerida();
            if (diferenciaExperiencia >= 0) {
                ajuste += 0.4; // experiencia suficiente
            } else {
                // Penalización proporcional hasta -0.4
                double penalizacion = Math.min(1.0, Math.abs(diferenciaExperiencia) / 10.0); // máximo -0.4
                ajuste += 0.4 * (1 - penalizacion);
            }

            // Nivel de estudio
            if ("Si".equalsIgnoreCase(datos.getCoincideEstudios())) {
                ajuste += 0.3;
            }

            // Sector
            if ("Si".equalsIgnoreCase(datos.getCoincideSector())) {
                ajuste += 0.3;
            }

            // Aplicar ajuste al porcentaje base
            double porcentajeAjustado = porcentajeBase * ajuste;

            // Redondear y limitar al máximo de 100
            long porcentajeFinal = Math.min(Math.round(porcentajeAjustado), 100);

            return ResponseEntity.ok().body(new ResultadoPrediccion(valorClase, porcentajeFinal));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al predecir compatibilidad");
        }
    }

    record ResultadoPrediccion(String compatible, long porcentaje) {

    }
}

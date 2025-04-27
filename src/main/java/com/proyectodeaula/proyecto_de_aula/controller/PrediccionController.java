package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.util.Map;

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
                    getClass().getClassLoader().getResourceAsStream("weka/Modelo_entrenado_empleo.model"))) {
                clasificador = (Classifier) ois.readObject();
            }

            // Cargar estructura ARFF desde recursos
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("weka/empleo_recomendacion_simplificado.arff");
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            estructura = new Instances(reader);
            estructura.setClassIndex(estructura.numAttributes() - 1);

        } catch (IOException | ClassNotFoundException e) {
        }
    }

    @PostMapping("/prediccion")
    public ResponseEntity<?> predecir(@RequestBody prediccion datos) {
        try {
            // 1. Crear instancia WEKA
            Instance instancia = new DenseInstance(estructura.numAttributes());
            instancia.setDataset(estructura);

            // 2. Asignar todos los valores del formulario
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

            // 3. Obtener la distribución de probabilidades
            double[] distribucion = clasificador.distributionForInstance(instancia);

            // 4. Obtener la clase predicha y su confianza
            double clasePredicha = clasificador.classifyInstance(instancia);
            double confianzaWeka = distribucion[(int) clasePredicha];

            // 5. Devolver el valor exacto de WEKA sin modificaciones
            return ResponseEntity.ok().body(Map.of(
                    "compatible", estructura.classAttribute().value((int) clasePredicha),
                    "confianzaWeka", confianzaWeka 
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                    "error", "Error en la predicción",
                    "detalle", e.getMessage()
            ));
        }
    }
    public record DetallePrediccion(String actual, String predicho, double confianzaWeka) {

    }
//    
}

package com.proyectodeaula.proyecto_de_aula.service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.model.prediccion;

import lombok.Getter;
import weka.classifiers.Classifier;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

@Service
public class WekaPredictionService {

    private final Classifier modelo;
    private final Instances estructura;

    public WekaPredictionService() throws Exception {
        // Cargar el modelo desde resources

        try (InputStream modelStream = getClass().getClassLoader().getResourceAsStream("weka/Modelo_entrenado_empleo.model")) {

            if (modelStream == null) {
                throw new FileNotFoundException("Modelo WEKA no encontrado en resources");
            }
            modelo = (Classifier) SerializationHelper.read(modelStream);
        }

        // Cargar estructura desde ARFF
        try (InputStream arffStream = getClass().getClassLoader().getResourceAsStream("weka/empleo_recomendacion_simplificado.arff")) {
            if (arffStream == null) {
                throw new FileNotFoundException("Archivo ARFF no encontrado en resources");
            }
            estructura = new Instances(new BufferedReader(new InputStreamReader(arffStream)));
            estructura.setClassIndex(estructura.numAttributes() - 1);
        }
    }

    public ResultadoPrediccion predecir(prediccion datos) throws Exception {
        // Crear instancia WEKA
        Instance instancia = new DenseInstance(estructura.numAttributes());
        instancia.setDataset(estructura);

        // Asignar valores - asegúrate que el orden coincide con el ARFF
        instancia.setValue(estructura.attribute("tipo_empleo_oferta"), datos.getTipoEmpleoOferta());
        instancia.setValue(estructura.attribute("modalidad_oferta"), datos.getModalidadOferta());
        instancia.setValue(estructura.attribute("tipo_contrato_oferta"), datos.getTipoContratoOferta());
        instancia.setValue(estructura.attribute("experiencia_requerida"), datos.getExperienciaRequerida());
        instancia.setValue(estructura.attribute("nivel_estudio_requerido"), datos.getNivelEstudioRequerido());
        instancia.setValue(estructura.attribute("sector_oferta"), datos.getSectorOferta());
        instancia.setValue(estructura.attribute("tipo_empleo_deseado"), datos.getTipoEmpleoDeseado());
        instancia.setValue(estructura.attribute("preferencia_modalidad"), datos.getPreferenciaModalidad());
        instancia.setValue(estructura.attribute("preferencia_contrato"), datos.getPreferenciaContrato());
        instancia.setValue(estructura.attribute("experiencia_persona"), datos.getExperienciaPersona());
        instancia.setValue(estructura.attribute("nivel_estudio_persona"), datos.getNivelEstudioPersona());
        instancia.setValue(estructura.attribute("sector_persona"), datos.getSectorPersona());
        instancia.setValue(estructura.attribute("edad_persona"), datos.getEdadPersona());
        instancia.setValue(estructura.attribute("coincide_tipo_empleo"), datos.getCoincideTipoEmpleo());
        instancia.setValue(estructura.attribute("coincide_modalidad"), datos.getCoincideModalidad());
        instancia.setValue(estructura.attribute("coincide_contrato"), datos.getCoincideContrato());
        instancia.setValue(estructura.attribute("coincide_estudios"), datos.getCoincideEstudios());
        instancia.setValue(estructura.attribute("coincide_sector"), datos.getCoincideSector());
        instancia.setValue(estructura.attribute("experiencia_suficiente"), datos.getExperienciaSuficiente());

        // Realizar predicción
        double prediccion = modelo.classifyInstance(instancia);
        String clasePredicha = estructura.classAttribute().value((int) prediccion);

        // Obtener distribución de probabilidad
        double[] distribucion = modelo.distributionForInstance(instancia);
        double porcentaje = distribucion[(int) prediccion] * 100;

        return new ResultadoPrediccion(clasePredicha, porcentaje);
    }

    @Getter
    public static class ResultadoPrediccion {

        private final String compatible;
        private final double porcentaje;

        public ResultadoPrediccion(String compatible, double porcentaje) {
            this.compatible = compatible;
            this.porcentaje = porcentaje;
        }
    }
}

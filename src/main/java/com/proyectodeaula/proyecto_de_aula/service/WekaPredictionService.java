package com.proyectodeaula.proyecto_de_aula.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.model.prediccion;

import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

@Service
public class WekaPredictionService {

    private Classifier modelo;
    private Instances dataStructure;

    public WekaPredictionService() throws Exception {
        // Cargar el modelo desde resources
        try (InputStream modelStream = getClass().getClassLoader().getResourceAsStream("weka/modelo_empleo_j48.model")) {
            modelo = (Classifier) SerializationHelper.read(modelStream);
        }

        // Crear estructura vacía basada en el ARFF original (sin datos)
        dataStructure = crearEstructuraDatos();
    }

    public ResultadoPrediccion predecir(prediccion datos) throws Exception {
        // Crear instancia
        Instance instancia = new DenseInstance(dataStructure.numAttributes());
        instancia.setDataset(dataStructure);

        // Asignar valores a los atributos 
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

        // Predecir
        double resultado = modelo.classifyInstance(instancia);
        String clase = dataStructure.classAttribute().value((int) resultado);

        // Distribución de probabilidad
        double[] distribucion = modelo.distributionForInstance(instancia);
        double porcentaje = distribucion[(int) resultado] * 100;

        return new ResultadoPrediccion(clase, Math.round(porcentaje));
    }

    private Instances crearEstructuraDatos() {
        ArrayList<Attribute> atributos = new ArrayList<>();

        // Atributos como en el ARFF, mismos nombres y orden
        atributos.add(new Attribute("tipo_empleo_oferta", List.of("Tiempo_Completo", "Medio_Tiempo", "Por_Horas", "Temporal")));
        atributos.add(new Attribute("modalidad_oferta", List.of("Presencial", "Remoto", "Hibrido")));
        atributos.add(new Attribute("tipo_contrato_oferta", List.of("Indefinido", "Practicas", "Obra_Servicio")));
        atributos.add(new Attribute("experiencia_requerida"));
        atributos.add(new Attribute("nivel_estudio_requerido", List.of("Bachillerato", "Tecnico", "Grado", "Master", "Doctorado")));
        atributos.add(new Attribute("sector_oferta", List.of("Tecnologia", "Educacion", "Salud", "Construccion", "Otros")));

        atributos.add(new Attribute("tipo_empleo_deseado", List.of("Tiempo_Completo", "Medio_Tiempo", "Por_Horas", "Temporal")));
        atributos.add(new Attribute("preferencia_modalidad", List.of("Presencial", "Remoto", "Hibrido")));
        atributos.add(new Attribute("preferencia_contrato", List.of("Indefinido", "Practicas", "Obra_Servicio")));
        atributos.add(new Attribute("experiencia_persona"));
        atributos.add(new Attribute("nivel_estudio_persona", List.of("Bachillerato", "Tecnico", "Grado", "Master", "Doctorado")));
        atributos.add(new Attribute("sector_persona", List.of("Tecnologia", "Educacion", "Salud", "Construccion", "Otros")));
        atributos.add(new Attribute("edad_persona"));

        atributos.add(new Attribute("coincide_tipo_empleo", List.of("Si", "No")));
        atributos.add(new Attribute("coincide_modalidad", List.of("Si", "No")));
        atributos.add(new Attribute("coincide_contrato", List.of("Si", "No")));
        atributos.add(new Attribute("coincide_estudios", List.of("Si", "No")));
        atributos.add(new Attribute("coincide_sector", List.of("Si", "No")));
        atributos.add(new Attribute("experiencia_suficiente", List.of("Si", "No")));

        atributos.add(new Attribute("compatible", List.of("Si", "No"))); // clase

        Instances estructura = new Instances("PrediccionCompatibilidad", atributos, 0);
        estructura.setClassIndex(estructura.numAttributes() - 1);
        return estructura;
    }

    public class ResultadoPrediccion {
        private String compatible;
        private long porcentaje;
    
        public ResultadoPrediccion(String compatible, long porcentaje) {
            this.compatible = compatible;
            this.porcentaje = porcentaje;
        }
    
        // Getters y setters
    }
    
}
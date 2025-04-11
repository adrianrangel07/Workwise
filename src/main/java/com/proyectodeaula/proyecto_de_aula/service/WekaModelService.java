package com.proyectodeaula.proyecto_de_aula.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.Arrays;

import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.model.prediccion;

import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

@Service
public class WekaModelService {

    private Classifier modelo;

    public WekaModelService() {
        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("weka/Modelo_entrenado.model");
            try (ObjectInputStream ois = new ObjectInputStream(inputStream)) {
                modelo = (Classifier) ois.readObject();
            }
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error cargando modelo: " + e.getMessage());
        }
    }

    public Instance construirInstancia(prediccion prediccion) {
        ArrayList<Attribute> atributos = new ArrayList<>();

        atributos.add(new Attribute("tipo_empleo_oferta", new ArrayList<>(Arrays.asList("Presencial", "Remoto", "Híbrido"))));
        atributos.add(new Attribute("modalidad_oferta", new ArrayList<>(Arrays.asList("Tiempo completo", "Medio tiempo", "Freelance"))));
        atributos.add(new Attribute("tipo_contrato_oferta", new ArrayList<>(Arrays.asList("Indefinido", "Temporal", "Prácticas"))));
        atributos.add(new Attribute("experiencia_requerida"));
        atributos.add(new Attribute("nivel_estudio_requerido", new ArrayList<>(Arrays.asList("Primaria", "Secundaria", "Técnico", "Universitario", "Postgrado"))));
        atributos.add(new Attribute("sector_oferta", new ArrayList<>(Arrays.asList("Tecnología", "Salud", "Educación", "Finanzas", "Comercio", "Otro"))));
        atributos.add(new Attribute("tipo_empleo_deseado", new ArrayList<>(Arrays.asList("Presencial", "Remoto", "Híbrido"))));
        atributos.add(new Attribute("preferencia_modalidad", new ArrayList<>(Arrays.asList("Tiempo completo", "Medio tiempo", "Freelance"))));
        atributos.add(new Attribute("preferencia_contrato", new ArrayList<>(Arrays.asList("Indefinido", "Temporal", "Prácticas"))));
        atributos.add(new Attribute("experiencia_persona"));
        atributos.add(new Attribute("nivel_estudio_persona", new ArrayList<>(Arrays.asList("Primaria", "Secundaria", "Técnico", "Universitario", "Postgrado"))));
        atributos.add(new Attribute("sector_persona", new ArrayList<>(Arrays.asList("Tecnología", "Salud", "Educación", "Finanzas", "Comercio", "Otro"))));
        atributos.add(new Attribute("edad_persona"));
        atributos.add(new Attribute("coincide_tipo_empleo", new ArrayList<>(Arrays.asList("Si", "No"))));
        atributos.add(new Attribute("coincide_modalidad", new ArrayList<>(Arrays.asList("Si", "No"))));
        atributos.add(new Attribute("coincide_contrato", new ArrayList<>(Arrays.asList("Si", "No"))));
        atributos.add(new Attribute("coincide_estudios", new ArrayList<>(Arrays.asList("Si", "No"))));
        atributos.add(new Attribute("coincide_sector", new ArrayList<>(Arrays.asList("Si", "No"))));
        atributos.add(new Attribute("experiencia_suficiente", new ArrayList<>(Arrays.asList("Si", "No"))));

        ArrayList<String> clase = new ArrayList<>(Arrays.asList("No", "Si"));
        atributos.add(new Attribute("compatible", clase));

        Instances data = new Instances("Prediccion", atributos, 0);
        data.setClassIndex(data.numAttributes() - 1);

        double[] valores = new double[data.numAttributes()];
        valores[0] = data.attribute(0).indexOfValue(prediccion.tipo_empleo_oferta);
        valores[1] = data.attribute(1).indexOfValue(prediccion.modalidad_oferta);
        valores[2] = data.attribute(2).indexOfValue(prediccion.tipo_contrato_oferta);
        valores[3] = prediccion.experiencia_requerida;
        valores[4] = data.attribute(4).indexOfValue(prediccion.nivel_estudio_requerido);
        valores[5] = data.attribute(5).indexOfValue(prediccion.sector_oferta);
        valores[6] = data.attribute(6).indexOfValue(prediccion.tipo_empleo_deseado);
        valores[7] = data.attribute(7).indexOfValue(prediccion.preferencia_modalidad);
        valores[8] = data.attribute(8).indexOfValue(prediccion.preferencia_contrato);
        valores[9] = prediccion.experiencia_persona;
        valores[10] = data.attribute(10).indexOfValue(prediccion.nivel_estudio_persona);
        valores[11] = data.attribute(11).indexOfValue(prediccion.sector_persona);
        valores[12] = prediccion.edad_persona;
        valores[13] = data.attribute(13).indexOfValue(prediccion.coincide_tipo_empleo);
        valores[14] = data.attribute(14).indexOfValue(prediccion.coincide_modalidad);
        valores[15] = data.attribute(15).indexOfValue(prediccion.coincide_contrato);
        valores[16] = data.attribute(16).indexOfValue(prediccion.coincide_estudios);
        valores[17] = data.attribute(17).indexOfValue(prediccion.coincide_sector);
        valores[18] = data.attribute(18).indexOfValue(prediccion.experiencia_suficiente);

        Instance instancia = new DenseInstance(1.0, valores);
        instancia.setDataset(data);
        return instancia;
    }

    public String predecir(prediccion prediccion) throws Exception {
        Instance instancia = construirInstancia(prediccion);
        double resultado = modelo.classifyInstance(instancia);
        return instancia.classAttribute().value((int) resultado);
    }

}

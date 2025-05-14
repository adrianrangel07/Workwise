package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.prediccion;
import com.proyectodeaula.proyecto_de_aula.dto.OfertaRecomendadaDTO;

import weka.classifiers.Classifier;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.OfertasRepository;

@RequestMapping("/api/prediccion")
@RestController
public class PrediccionController {

    @Autowired
    private OfertasRepository ofertaRepository;

    private Classifier clasificador;
    private Instances estructura;

    public PrediccionController() {
        try {
            // 1. Cargar modelo
            try (ObjectInputStream ois = new ObjectInputStream(
                    getClass().getClassLoader().getResourceAsStream("weka/Modelo_entrenado_empleo.model"))) {
                clasificador = (Classifier) ois.readObject();
            }
    
            // 2. Cargar estructura ARFF
            try (InputStream arffStream = getClass().getClassLoader()
                    .getResourceAsStream("weka/empleo_recomendacion_simplificado.arff")) {
                
                if (arffStream == null) {
                    throw new FileNotFoundException("Archivo ARFF no encontrado en resources");
                }
    
                estructura = new Instances(new BufferedReader(
                        new InputStreamReader(arffStream, StandardCharsets.UTF_8)));
                estructura.setClassIndex(estructura.numAttributes() - 1);
            }
    
        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException("Error al cargar recursos", e);
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

    @PostMapping("/recomendar")
    public ResponseEntity<?> recomendarOfertas(@RequestBody prediccion datos) {
        try {
            // Obtener todas las ofertas de la base de datos
            List<Ofertas> ofertas = ofertaRepository.findAll();
            System.out.println("Ofertas: " + ofertas);
            List<OfertaRecomendadaDTO> recomendadas = new ArrayList<>();

            
            for (Ofertas oferta : ofertas) {
                // Crear una instancia de WEKA para cada oferta
                Instance instancia = new DenseInstance(estructura.numAttributes());
                instancia.setDataset(estructura);

                // Asignar los valores de la oferta
                instancia.setValue(0, oferta.getTipo_empleo());
                instancia.setValue(1, oferta.getModalidad());
                instancia.setValue(2, oferta.getTipo_contrato());
                instancia.setValue(3, oferta.getExperiencia());
                instancia.setValue(4, oferta.getNivel_educativo());
                instancia.setValue(5, oferta.getSector_oferta());

                instancia.setValue(6, datos.getTipoEmpleoDeseado());
                instancia.setValue(7, datos.getPreferenciaModalidad());
                instancia.setValue(8, datos.getPreferenciaContrato());
                instancia.setValue(9, datos.getExperienciaPersona());
                instancia.setValue(10, datos.getNivelEstudioPersona());
                instancia.setValue(11, datos.getSectorPersona());
                instancia.setValue(12, datos.getEdadPersona());
                // Atributo 13: coincide_tipo_empleo
                instancia.setValue(estructura.attribute("coincide_tipo_empleo"), 
                estructura.attribute("coincide_tipo_empleo").indexOfValue(
                    oferta.getTipo_empleo().equals(datos.getTipoEmpleoDeseado()) ? "Si" : "No"
                ));

                // Atributo 14: coincide_modalidad
                instancia.setValue(estructura.attribute("coincide_modalidad"), 
                estructura.attribute("coincide_modalidad").indexOfValue(
                    oferta.getModalidad().equals(datos.getPreferenciaModalidad()) ? "Si" : "No"
                ));

                // Atributo 15: coincide_contrato
                instancia.setValue(estructura.attribute("coincide_contrato"), 
                estructura.attribute("coincide_contrato").indexOfValue(
                    oferta.getTipo_contrato().equals(datos.getPreferenciaContrato()) ? "Si" : "No"
                ));

                // Atributo 16: coincide_estudios
                instancia.setValue(estructura.attribute("coincide_estudios"), 
                estructura.attribute("coincide_estudios").indexOfValue(
                    datos.getNivelEstudioPersona().equals(oferta.getNivel_educativo()) ? "Si" : "No"
                ));

                // Atributo 17: coincide_sector
                instancia.setValue(estructura.attribute("coincide_sector"), 
                estructura.attribute("coincide_sector").indexOfValue(
                    oferta.getSector_oferta().equals(datos.getSectorPersona()) ? "Si" : "No"
                ));

                // Atributo 18: experiencia_suficiente
                instancia.setValue(estructura.attribute("experiencia_suficiente"), 
                estructura.attribute("experiencia_suficiente").indexOfValue(
                    datos.getExperienciaPersona() >= oferta.getExperiencia() ? "Si" : "No"
                ));

                double[] distribucion = clasificador.distributionForInstance(instancia);
                double clase = clasificador.classifyInstance(instancia);
                String clasePredicha = estructura.classAttribute().value((int) clase);
                double confianza = distribucion[(int) clase];

                // Si la clase es "compatible", agregar a la lista de recomendadas
                if ("Si".equalsIgnoreCase(clasePredicha)) {
                    OfertaRecomendadaDTO dto = new OfertaRecomendadaDTO(oferta, confianza);
                    dto.setIdOferta(oferta.getId());
                    dto.setTitulo(oferta.getTitulo_puesto());
                    dto.setDescripcion(oferta.getDescripcion());
                    dto.setDuracion(oferta.getDuracion());
                    dto.setSalario(oferta.getSalario());
                    dto.setTipoEmpleo(oferta.getTipo_empleo());
                    dto.setModalidad(oferta.getModalidad());
                    dto.setTipoContrato(oferta.getTipo_contrato());
                    dto.setExperiencia(oferta.getExperiencia());
                    dto.setMoneda(oferta.getMoneda());
                    dto.setPeriodo(oferta.getPeriodo());
                    dto.setSector(oferta.getSector_oferta());
                    dto.setNivelEstudio(oferta.getNivel_educativo());
                    dto.setConfianza(confianza);

                    if (oferta.getEmpresa() != null) {
                        dto.setIdEmpresa(oferta.getEmpresa().getId());
                        dto.setNombreEmpresa(oferta.getEmpresa().getNombreEmp());
                    }
                    recomendadas.add(dto);
                }
                else {
                    System.out.println("Oferta NO recomendada: " + oferta.getId() + " | Clase: " + clasePredicha+ " | Confianza: " + distribucion[(int) clase]);
                }
            }
            

            recomendadas.sort(Comparator.comparingDouble(OfertaRecomendadaDTO::getConfianza).reversed());
            return ResponseEntity.ok(recomendadas.stream().limit(6).collect(Collectors.toList()));
    
        } catch (Exception e) {
            // Log detallado
            System.err.println("Error en predicción: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                    "error", "Datos inválidos",
                    "detalle", (e.getMessage() != null) ? e.getMessage() : "Campo 'value' es nulo"
                )
            );
        }
    }

    public record DetallePrediccion(String actual, String predicho, double confianzaWeka) {
    }
}

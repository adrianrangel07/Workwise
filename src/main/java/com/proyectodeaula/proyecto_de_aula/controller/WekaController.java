package com.proyectodeaula.proyecto_de_aula.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.model.prediccion;
import com.proyectodeaula.proyecto_de_aula.service.WekaModelService;

@RestController
public class WekaController {

    @Autowired
    private WekaModelService wekaModelService;

    @PostMapping("/predecir")
    public String predecir(@RequestBody prediccion prediccion) {
        try {
            // Validaciones automáticas
            prediccion.coincide_tipo_empleo = prediccion.tipo_empleo_oferta.equals(prediccion.tipo_empleo_deseado) ? "Si" : "No";
            prediccion.coincide_modalidad = prediccion.modalidad_oferta.equals(prediccion.preferencia_modalidad) ? "Si" : "No";
            prediccion.coincide_contrato = prediccion.tipo_contrato_oferta.equals(prediccion.preferencia_contrato) ? "Si" : "No";
            prediccion.coincide_estudios = prediccion.nivel_estudio_requerido.equals(prediccion.nivel_estudio_persona) ? "Si" : "No";
            prediccion.coincide_sector = prediccion.sector_oferta.equals(prediccion.sector_persona) ? "Si" : "No";
            prediccion.experiencia_suficiente = prediccion.experiencia_persona >= prediccion.experiencia_requerida ? "Si" : "No";

            return wekaModelService.predecir(prediccion);
        } catch (Exception e) {
            return "Error en predicción: " + e.getMessage();
        }
    }

}

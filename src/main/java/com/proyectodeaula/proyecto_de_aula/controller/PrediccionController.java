package com.proyectodeaula.proyecto_de_aula.controller;


import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.model.PrediccionRequest;
import com.proyectodeaula.proyecto_de_aula.service.WekaPredictionService;


@RequestMapping("/api/prediccion")
@RestController
public class PrediccionController {

    private final WekaPredictionService predictionService;

    public PrediccionController(WekaPredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/prediccion")
    public ResponseEntity<?> predecir(@RequestBody PrediccionRequest datos) {
        try {
            WekaPredictionService.ResultadoPrediccion resultado = predictionService.predecir(datos);

            return ResponseEntity.ok().body(Map.of(
                    "compatible", resultado.getCompatible(),
                    "confianzaWeka", resultado.getPorcentaje() / 100.0, // Convertir a decimal
                    "porcentaje", resultado.getPorcentaje() + "%" // Para mostrar directamente
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Error en la predicción",
                            "detalle", e.getMessage()
                    ));
        }
    }
}


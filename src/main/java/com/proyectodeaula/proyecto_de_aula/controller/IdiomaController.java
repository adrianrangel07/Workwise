package com.proyectodeaula.proyecto_de_aula.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/traducciones")
public class IdiomaController {
    @GetMapping({"/{pagina}/{idioma}", "/{carpeta}/{pagina}/{idioma}"})
    public ResponseEntity<Map<String, String>> obtenerTraducciones(
        @PathVariable(required = false) String carpeta,
        @PathVariable String pagina,
        @PathVariable String idioma) {
            try {
                String rutaArchivo;
        
                if (carpeta != null) {
                    rutaArchivo = String.format("traductor/%s/%s/%s.json", carpeta, pagina, idioma);
                } else {
                    rutaArchivo = String.format("traductor/%s/%s.json", pagina, idioma);
                }
            ClassPathResource resource = new ClassPathResource(rutaArchivo);

            try (var inputStream = resource.getInputStream()) {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, String> traducciones = mapper.readValue(inputStream,
                        new com.fasterxml.jackson.core.type.TypeReference<>() {});
                return ResponseEntity.ok(traducciones);
            }
    

        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

}

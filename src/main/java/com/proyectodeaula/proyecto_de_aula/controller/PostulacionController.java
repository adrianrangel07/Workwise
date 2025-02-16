package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.Optional;

import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.OfertasRepository;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.PostulacionRepository;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;

// import jakarta.servlet.http.HttpSession;

@Controller
public class PostulacionController {

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private OfertasRepository ofertaRepository;

    @Autowired
    private Interfaz_Per personaRepository;

    @PostMapping("/postularse")
    public ResponseEntity<Map<String, Object>> postularse(@RequestBody Map<String, Long> request) {
        Long ofertaId = request.get("ofertaId");
        Long usuarioId = request.get("usuarioId");

        // Verificar si el usuario ya está postulado
        Optional<Postulacion> postulacionExistente = postulacionRepository.findByOfertasIdAndPersonasId(ofertaId,
                usuarioId);

        if (postulacionExistente.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Ya estás postulado a esta oferta.");
            return ResponseEntity.ok(response); // Responder con mensaje de que ya está postulado
        }

        // Si no está postulado, realizar la postulación
        Optional<Ofertas> ofertaOpt = ofertaRepository.findById(ofertaId);
        Optional<Personas> personaOpt = personaRepository.findById(usuarioId);

        if (!ofertaOpt.isPresent() || !personaOpt.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Oferta o persona no encontrados.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Crear y guardar la postulación
        Ofertas oferta = ofertaOpt.get();
        Personas persona = personaOpt.get();
        Postulacion postulacion = new Postulacion();
        postulacion.setOfertas(oferta);
        postulacion.setPersonas(persona);
        postulacion.setN_personas(1);
        postulacionRepository.save(postulacion);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Postulación exitosa");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/postulacion/eliminar/{id}")
    public ResponseEntity<Map<String, Object>> eliminarPostulacion(@PathVariable Long id) {
        Optional<Postulacion> postulacionOpt = postulacionRepository.findById(id);

        if (!postulacionOpt.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Postulación no encontrada.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Eliminar la postulación
        postulacionRepository.delete(postulacionOpt.get());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Postulación eliminada con éxito.");
        return ResponseEntity.ok(response);
    }

}

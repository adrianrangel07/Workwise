package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.OfertasRepository;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.PostulacionRepository;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;

// import jakarta.servlet.http.HttpSession;
@Controller
@RestController
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
        postulacion.setEstado("Pendiente");
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

    @GetMapping("/ofertas/{id}/postulaciones")
    public ResponseEntity<List<Map<String, Object>>> obtenerPostulaciones(@PathVariable Long id) {
        List<Postulacion> postulaciones = postulacionRepository.findByOfertasId(id);

        if (postulaciones == null || postulaciones.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Map<String, Object>> resultado = postulaciones.stream()
                .filter(postulacion -> postulacion.getPersonas() != null)
                .map(postulacion -> {
                    Map<String, Object> postulanteData = new HashMap<>();
                    postulanteData.put("postulacionId", postulacion.getId());
                    postulanteData.put("id", postulacion.getPersonas().getId());
                    postulanteData.put("nombre", postulacion.getPersonas().getNombre());
                    postulanteData.put("apellido", postulacion.getPersonas().getApellido());
                    postulanteData.put("estado", postulacion.getEstado()); // Añadir esta línea
                    return postulanteData;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/postulaciones/{id}/verHDV")
    public ResponseEntity<byte[]> verCVDesdePostulacion(@PathVariable Long id) {
        Optional<Postulacion> postulacionOpt = postulacionRepository.findById(id);

        if (postulacionOpt.isPresent()) {
            Personas persona = postulacionOpt.get().getPersonas();

            if (persona != null && persona.getCv() != null) {
                byte[] cvBytes = persona.getCv();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDisposition(ContentDisposition.inline().filename("CV_" + persona.getId() + ".pdf").build());

                return new ResponseEntity<>(cvBytes, headers, HttpStatus.OK);
            }
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/postulaciones/{id}/estado")
    public ResponseEntity<Map<String, Object>> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        System.out.println("✅ Actualizando estado para postulación ID: " + id);
        System.out.println("📌 Nuevo estado: " + body.get("estado"));

        Optional<Postulacion> postulacionOpt = postulacionRepository.findById(id);
        if (!postulacionOpt.isPresent()) {
            System.out.println("❌ Postulación no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Collections.singletonMap("error", "Postulación no encontrada")
            );
        }

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Collections.singletonMap("error", "El estado no puede estar vacío")
            );
        }

        Postulacion postulacion = postulacionOpt.get();
        System.out.println("🔄 Estado anterior: " + postulacion.getEstado());
        postulacion.setEstado(nuevoEstado);

        // Guardar explícitamente
        try {
            postulacionRepository.save(postulacion);
            System.out.println("💾 Estado guardado: " + postulacion.getEstado());

            // Verificar en base de datos
            Optional<Postulacion> postGuardada = postulacionRepository.findById(id);
            System.out.println("🔍 Estado en BD después de guardar: "
                    + postGuardada.map(Postulacion::getEstado).orElse("NO ENCONTRADA"));
        } catch (Exception e) {
            System.out.println("❌ Error al guardar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error al guardar"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estado actualizado correctamente");
        response.put("estado", nuevoEstado);
        response.put("postulacionId", id);

        return ResponseEntity.ok(response);
    }

}

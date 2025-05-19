package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IpersonaService;
import com.proyectodeaula.proyecto_de_aula.interfaceService.VerificationCodeGenerator;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.service.EmailService;

@RestController
@RequestMapping("/api")
public class VerificationController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private IpersonaService personaService;

    @Autowired
    private Interfaz_Per user;

    // Almacena temporalmente los códigos con su tiempo de creación
    private static final Map<String, CodeData> verificationCodes = new ConcurrentHashMap<>();

    // Clase interna para almacenar código y timestamp
    private static class CodeData {
        String code;
        long creationTime;

        public CodeData(String code) {
            this.code = code;
            this.creationTime = System.currentTimeMillis();
        }

        public boolean isExpired(long expirationMinutes) {
            long elapsedTime = System.currentTimeMillis() - creationTime;
            return TimeUnit.MILLISECONDS.toMinutes(elapsedTime) >= expirationMinutes;
        }
    }

    @PostMapping(value = "/send-verification-email", consumes = { "application/json",
            "application/x-www-form-urlencoded" })
    public ResponseEntity<Map<String, String>> sendVerificationEmail(
            @RequestParam(required = false, name = "email") String emailParam,
            @RequestBody(required = false) Map<String, String> body) {

        Map<String, String> response = new HashMap<>();

        // Obtener el email de cualquiera de las dos fuentes
        String email = emailParam != null ? emailParam : (body != null ? body.get("email") : null);

        if (email == null || email.isEmpty()) {
            response.put("error", "El correo electrónico es requerido");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Validar el formato del email
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response.put("error", "Correo electrónico inválido");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar si el email ya está verificado
            Personas persona = user.findByEmail(email);
            if (persona != null && persona.isEmailVerificado()) {
                response.put("message", "Este correo ya está verificado");
                return ResponseEntity.ok(response);
            }

            String verificationCode = VerificationCodeGenerator.generateVerificationCode();
            verificationCodes.put(email, new CodeData(verificationCode));

            emailService.sendVerificationEmail(email, verificationCode);

            response.put("message", "Código de verificación enviado a " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            verificationCodes.remove(email);
            response.put("error", "Error al enviar el correo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(
            @RequestParam String email,
            @RequestParam String code) {

        Map<String, String> response = new HashMap<>();

        // Validaciones básicas
        if (email == null || email.isEmpty()) {
            response.put("error", "El correo electrónico es requerido");
            return ResponseEntity.badRequest().body(response);
        }

        if (code == null || code.isEmpty()) {
            response.put("error", "El código de verificación es requerido");
            return ResponseEntity.badRequest().body(response);
        }

        CodeData codeData = verificationCodes.get(email);

        // Verificar si existe un código para este email
        if (codeData == null) {
            response.put("error", "No se encontró código para este correo. Por favor solicita uno nuevo.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Verificar si el código ha expirado (10 minutos)
        if (codeData.isExpired(10)) {
            verificationCodes.remove(email);
            response.put("error", "El código ha expirado. Por favor solicita uno nuevo.");
            return ResponseEntity.status(HttpStatus.GONE).body(response);
        }

        // Verificar el código
        if (codeData.code.equals(code)) {
            verificationCodes.remove(email);

            // Actualizar solo el estado de verificación en la base de datos
            try {
                personaService.actualizarEstadoVerificacion(email, true);

                response.put("message", "Correo electrónico verificado con éxito");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                response.put("error", "Error al actualizar el estado de verificación: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else {
            response.put("error", "Código incorrecto. Por favor intenta nuevamente.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/is-verified")
    public ResponseEntity<Boolean> isEmailVerified(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(false);
        }

        Personas persona = user.findByEmail(email);
        if (persona != null) {
            return ResponseEntity.ok(persona.isEmailVerificado());
        }
        return ResponseEntity.ok(false);
    }
}
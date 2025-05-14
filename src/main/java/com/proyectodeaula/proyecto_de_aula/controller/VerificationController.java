package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyectodeaula.proyecto_de_aula.interfaceService.VerificationCodeGenerator;
import com.proyectodeaula.proyecto_de_aula.service.EmailService;

@RestController
@RequestMapping("/api")
public class VerificationController {

    @Autowired
    private EmailService emailService;

    private static final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private static final Map<String, Boolean> verifiedEmails = new ConcurrentHashMap<>();

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

            String verificationCode = VerificationCodeGenerator.generateVerificationCode();
            verificationCodes.put(email, verificationCode);
            verifiedEmails.remove(email); // Eliminar verificación previa

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

        String storedCode = verificationCodes.get(email);
        if (storedCode == null) {
            response.put("error", "No se encontró código para este correo. Por favor solicita uno nuevo.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (storedCode.equals(code)) {
            verificationCodes.remove(email);
            verifiedEmails.put(email, true);
            response.put("message", "Código verificado con éxito");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Código incorrecto. Por favor intenta nuevamente.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/is-verified")
    public ResponseEntity<Boolean> isEmailVerified(@RequestParam String email) {
        return ResponseEntity.ok(verifiedEmails.getOrDefault(email, false));
    }
}
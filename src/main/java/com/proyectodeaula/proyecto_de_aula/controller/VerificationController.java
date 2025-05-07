package com.proyectodeaula.proyecto_de_aula.controller;

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

    // Almacenamiento temporal de códigos (en producción usa Redis o DB)
    private static final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private static final Map<String, Boolean> verifiedEmails = new ConcurrentHashMap<>();

    @PostMapping("/send-verification-email")
    public ResponseEntity<String> sendVerificationEmail(@RequestParam String email) {
        try {
            // Validar el formato del email
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body("Correo electrónico inválido");
            }

            String verificationCode = VerificationCodeGenerator.generateVerificationCode();
            verificationCodes.put(email, verificationCode);
            verifiedEmails.remove(email); // Eliminar verificación previa

            emailService.sendVerificationEmail(email, verificationCode);

            return ResponseEntity.ok("Código de verificación enviado a " + email);
        } catch (Exception e) {
            verificationCodes.remove(email);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el correo: " + e.getMessage());
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(
            @RequestParam String email,
            @RequestParam String code) {

        // Verificar si el correo existe en los códigos generados
        String storedCode = verificationCodes.get(email);
        if (storedCode == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró código para este correo. Por favor solicita uno nuevo.");
        }

        // Verificar si el código coincide
        if (storedCode.equals(code)) {
            verificationCodes.remove(email);
            verifiedEmails.put(email, true); // Marcar como verificado
            return ResponseEntity.ok("Código verificado con éxito");
        } else {
            return ResponseEntity.badRequest().body("Código incorrecto. Por favor intenta nuevamente.");
        }
    }

    @GetMapping("/is-verified")
    public ResponseEntity<Boolean> isEmailVerified(@RequestParam String email) {
        return ResponseEntity.ok(verifiedEmails.getOrDefault(email, false));
    }
}

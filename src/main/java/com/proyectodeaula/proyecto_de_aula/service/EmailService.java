package com.proyectodeaula.proyecto_de_aula.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Código de Verificación para tu Registro");

        String emailText = String.format(
                "¡Gracias por registrarte!\n\n"
                + "Tu código de verificación es: %s\n\n"
                + "Este código expirará en 10 minutos.\n\n"
                + "Si no solicitaste este código, por favor ignora este mensaje.",
                verificationCode);

        message.setText(emailText);

        mailSender.send(message);
    }
}

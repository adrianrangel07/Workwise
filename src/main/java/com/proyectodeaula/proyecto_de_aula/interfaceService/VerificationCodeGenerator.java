package com.proyectodeaula.proyecto_de_aula.interfaceService;

import java.util.Random;

public class VerificationCodeGenerator {
    public static String generateVerificationCode() {
        Random rand = new Random();
        int code = 100000 + rand.nextInt(900000); // 6 dígitos
        return String.valueOf(code);
    }
}


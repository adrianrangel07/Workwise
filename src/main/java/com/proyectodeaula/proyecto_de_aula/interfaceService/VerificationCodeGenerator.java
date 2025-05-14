package com.proyectodeaula.proyecto_de_aula.interfaceService;

import java.security.SecureRandom;

public class VerificationCodeGenerator {
    private static final String NUMBERS = "0123456789";
    private static final int CODE_LENGTH = 6;

    public static String generateVerificationCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        SecureRandom random = new SecureRandom();
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(NUMBERS.length());
            code.append(NUMBERS.charAt(index));
        }
        
        return code.toString();
    }
}

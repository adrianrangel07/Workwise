package com.proyectodeaula.proyecto_de_aula.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
public class NotificacionSSEController {

    private final CopyOnWriteArrayList<SseEmitter> emisores = new CopyOnWriteArrayList<>();

    @GetMapping("/notificaciones")
    public SseEmitter conectar() {
        SseEmitter emisor = new SseEmitter(0L); // Tiempo ilimitado de conexión
        emisores.add(emisor);

        emisor.onCompletion(() -> emisores.remove(emisor));
        emisor.onTimeout(() -> emisores.remove(emisor));

        return emisor;
    }

    public void enviarNotificacion(String mensaje) {
        for (SseEmitter emisor : emisores) {
            try {
                emisor.send(SseEmitter.event().data(mensaje));
            } catch (IOException e) {
                emisores.remove(emisor);
            }
        }
    }
}


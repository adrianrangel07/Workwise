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
        SseEmitter emisor = new SseEmitter(60_000L); // 1 minuto de timeout
        
        emisor.onCompletion(() -> {
            synchronized (this.emisores) {
                this.emisores.remove(emisor);
            }
        });
        
        emisor.onTimeout(() -> {
            emisor.complete();
            synchronized (this.emisores) {
                this.emisores.remove(emisor);
            }
        });
        
        synchronized (this.emisores) {
            this.emisores.add(emisor);
        }
        
        return emisor;
    }

    public void enviarNotificacion(String mensaje, String tipo) {
        synchronized (this.emisores) {
            for (SseEmitter emisor : this.emisores) {
                try {
                    String json = String.format("{\"mensaje\":\"%s\", \"tipo\":\"%s\"}", 
                        mensaje.replace("\"", "\\\""),
                        tipo);
                    emisor.send(SseEmitter.event()
                            .name("notificacion")
                            .data(json));
                } catch (IOException e) {
                    emisor.completeWithError(e);
                    this.emisores.remove(emisor);
                }
            }
        }
    }
}
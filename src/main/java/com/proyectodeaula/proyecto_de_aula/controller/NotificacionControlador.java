package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectodeaula.proyecto_de_aula.model.Notificacion;
import com.proyectodeaula.proyecto_de_aula.service.NotificacionServicio;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionControlador {
    private final NotificacionServicio notificacionServicio;

    public NotificacionControlador(NotificacionServicio notificacionServicio) {
        this.notificacionServicio = notificacionServicio;
    }

    @GetMapping("/{usuarioId}")
    public List<Notificacion> obtenerNotificaciones(@PathVariable Long usuarioId) {
        return notificacionServicio.obtenerNotificacionesNoLeidas(usuarioId);
    }

    @PostMapping("/{usuarioId}/leer")
    public void marcarComoLeidas(@PathVariable Long usuarioId) {
        notificacionServicio.marcarComoLeidas(usuarioId);
    }
}

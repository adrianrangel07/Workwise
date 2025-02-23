package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.notificaciones.NotificacionRepositorio;
import com.proyectodeaula.proyecto_de_aula.model.Notificacion;
import com.proyectodeaula.proyecto_de_aula.model.Personas;

@Service
public class NotificacionServicio {

    private final NotificacionRepositorio notificacionRepositorio;
    private final Interfaz_Per personasRepositorio; // Inyectamos correctamente

    public NotificacionServicio(NotificacionRepositorio notificacionRepositorio, Interfaz_Per personasRepositorio) {
        this.notificacionRepositorio = notificacionRepositorio;
        this.personasRepositorio = personasRepositorio;
    }

    public List<Notificacion> obtenerNotificacionesNoLeidas(Long personaId) {
        Personas persona = personasRepositorio.findById(personaId).orElse(null);
        if (persona == null) {
            return List.of(); // Retorna lista vacía si no encuentra la persona
        }
        return notificacionRepositorio.findByPersonaAndLeidaFalse(persona);
    }

    public void marcarComoLeidas(Long personaId) {
        Personas persona = personasRepositorio.findById(personaId).orElse(null);
        if (persona == null) {
            return;
        }
        List<Notificacion> notificaciones = notificacionRepositorio.findByPersonaAndLeidaFalse(persona);
        notificaciones.forEach(n -> n.setLeida(true));
        notificacionRepositorio.saveAll(notificaciones);
    }

    public void crearNotificacion(String string, long id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}

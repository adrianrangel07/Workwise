package com.proyectodeaula.proyecto_de_aula.interfaces.notificaciones;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Notificacion;
import com.proyectodeaula.proyecto_de_aula.model.Personas;

@Repository
public interface NotificacionRepositorio extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByPersonaAndLeidaFalse(Personas persona);
}


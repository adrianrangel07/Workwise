package com.proyectodeaula.proyecto_de_aula.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mensaje;
    private boolean leida;
    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "persona_id") // Relación con usuario
    private Personas persona;

    public Notificacion(String mensaje, Personas persona) {
        this.mensaje = mensaje;
        this.persona = persona;
        this.fechaCreacion = LocalDateTime.now();
        this.leida = false;
    }

    // Getters y Setters
}

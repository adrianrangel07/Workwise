package com.proyectodeaula.proyecto_de_aula.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Postulacion")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(name = "n_personas", columnDefinition = "Int", nullable = false)
    int n_personas;

    @Column(name = "estado", columnDefinition = "VARCHAR(45)", nullable = false)
    String estado;

    // Relación con la clase Oferta (de muchos a uno)
    @ManyToOne
    @JoinColumn(name = "oferta_id") // La clave foránea que apunta a Ofertas
    @JsonIgnore
    private Ofertas ofertas;

    // Relación con la clase Personas
    @ManyToOne
    @JoinColumn(name = "persona_id") // Nombre de la columna en la tabla 'Postulacion'
    @JsonIgnore
    private Personas personas;

}
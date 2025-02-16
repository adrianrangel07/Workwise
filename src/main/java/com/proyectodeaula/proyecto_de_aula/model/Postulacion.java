package com.proyectodeaula.proyecto_de_aula.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Postulacion")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(name = "n_personas", columnDefinition = "Int", nullable = false)
    int n_personas;

    // Relación con la clase Oferta (de muchos a uno)
    @ManyToOne
    @JoinColumn(name = "oferta_id") // La clave foránea que apunta a Ofertas
    private Ofertas ofertas;

    // Relación con la clase Personas
    @ManyToOne
    @JoinColumn(name = "persona_id") // Nombre de la columna en la tabla 'Postulacion'
    private Personas personas;

    // Getters y Setters

    public Postulacion() {
    }

    public Postulacion(long id, int n_personas, Ofertas ofertas, Personas persona) {
        this.id = id;
        this.n_personas = n_personas;
        this.ofertas = ofertas;
        this.personas = persona;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getN_personas() {
        return n_personas;
    }

    public void setN_personas(int n_personas) {
        this.n_personas = n_personas;
    }

    

    public Ofertas getOfertas() {
        return ofertas;
    }

    public void setOfertas(Ofertas ofertas) {
        this.ofertas = ofertas;
    }

    public Personas getPersonas() {
        return personas;
    }

    public void setPersonas(Personas personas) {
        this.personas = personas;
    }
 
}
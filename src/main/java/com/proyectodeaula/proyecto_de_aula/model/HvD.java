package com.proyectodeaula.proyecto_de_aula.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Hoja_de_vida")
public class HvD {
    
  	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "experienciaLaboral", columnDefinition = "VARCHAR(255)", nullable = false)
    private String experienciaLaboral;

    @Column(name = "educacion", columnDefinition = "VARCHAR(45)", nullable = false)
    private String educacion;

    @Column(name = "habilidades", columnDefinition = "VARCHAR(255)", nullable = false)
    private String habilidades;

    @Column(name = "idiomas", columnDefinition = "VARCHAR(45)", nullable = false)
    private String idiomas;

    @Column(name = "nacionalidad", columnDefinition = "VARCHAR(45)", nullable = false)
    private String nacionalidad;

    @Column(name = "estado_civil", columnDefinition = "VARCHAR(45)", nullable = false)
    private String estado_civil;

    @OneToOne(mappedBy = "hvd", cascade = CascadeType.ALL)
    private Personas persona;

    public HvD() {
    }

    public HvD(String experienciaLaboral, String educacion, String habilidades, String idiomas, String nacionalidad,
               String estado_civil) {
        this.experienciaLaboral = experienciaLaboral;
        this.educacion = educacion;
        this.habilidades = habilidades;
        this.idiomas = idiomas;
        this.nacionalidad = nacionalidad;
        this.estado_civil = estado_civil;
    }
    public String getExperienciaLaboral() {
        return experienciaLaboral;
    }

    public void setExperienciaLaboral(String experienciaLaboral) {
        this.experienciaLaboral = experienciaLaboral;
    }

    public String getEducacion() {
        return educacion;
    }

    public void setEducacion(String educacion) {
        this.educacion = educacion;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public String getIdiomas() {
        return idiomas;
    }

    public void setIdiomas(String idiomas) {
        this.idiomas = idiomas;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public String getEstado_civil() {
        return estado_civil;
    }

    public void setEstado_civil(String estado_civil) {
        this.estado_civil = estado_civil;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Personas getPersona() {
        return persona;
    }

    public void setPersona(Personas persona) {
        this.persona = persona;
    }

}

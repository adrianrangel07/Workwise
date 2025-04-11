package com.proyectodeaula.proyecto_de_aula.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "prediccion")
public class prediccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(name = "tipo_empleo_oferta", columnDefinition = "VARCHAR(255)")
    public String tipo_empleo_oferta;
    
    @Column(name = "modalidad_oferta", columnDefinition = "VARCHAR(255)")
    public String modalidad_oferta;
    
    @Column(name = "tipo_contrato_oferta", columnDefinition = "VARCHAR(255)")
    public String tipo_contrato_oferta;
    
    @Column(name = "experiencia_requerida", columnDefinition = "DOUBLE")
    public double experiencia_requerida;
    
    @Column(name = "nivel_estudio_requerido", columnDefinition = "VARCHAR(255)")
    public String nivel_estudio_requerido;
    
    @Column(name = "sector_oferta", columnDefinition = "VARCHAR(255)")
    public String sector_oferta;
    
    @Column(name = "tipo_empleo_deseado", columnDefinition = "VARCHAR(255)")
    public String tipo_empleo_deseado;
    
    @Column(name = "preferencia_modalidad", columnDefinition = "VARCHAR(255)")
    public String preferencia_modalidad;
    
    @Column(name = "preferencia_contrato", columnDefinition = "VARCHAR(255)")
    public String preferencia_contrato;
    
    @Column(name = "experiencia_persona", columnDefinition = "DOUBLE")
    public double experiencia_persona;
    
    @Column(name = "nivel_estudio_persona", columnDefinition = "VARCHAR(255)")
    public String nivel_estudio_persona;
    
    @Column(name = "sector_persona", columnDefinition = "VARCHAR(255)")
    public String sector_persona;
    
    @Column(name = "edad_persona", columnDefinition = "DOUBLE")
    public double edad_persona;
    
    @Column(name = "coincide_tipo_empleo", columnDefinition = "VARCHAR(255)")
    public String coincide_tipo_empleo;
    
    @Column(name = "coincide_modalidad", columnDefinition = "VARCHAR(255)")
    public String coincide_modalidad;
    
    @Column(name = "coincide_contrato", columnDefinition = "VARCHAR(255)")
    public String coincide_contrato;
    
    @Column(name = "coincide_estudios", columnDefinition = "VARCHAR(255)")
    public String coincide_estudios;
    
    @Column(name = "coincide_sector", columnDefinition = "VARCHAR(255)")
    public String coincide_sector;
    
    @Column(name = "experiencia_suficiente", columnDefinition = "VARCHAR(255)")
    public String experiencia_suficiente;
}

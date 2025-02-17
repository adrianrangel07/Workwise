package com.proyectodeaula.proyecto_de_aula.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
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
@Table(name = "Hoja_de_vida")
public class HvD {
    
  	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Datos Personales
    @Column(name = "nombre", columnDefinition = "VARCHAR(45)", nullable = false)
    private String nombre;
    @Column(name = "apellido", columnDefinition = "VARCHAR(45)", nullable = false)  
    private String apellido;
    @Column(name = "email", columnDefinition = "VARCHAR(45)", nullable = false)
    private String email;
    @Column(name = "telefono", columnDefinition = "DATE", nullable = false)  
    private String telefono;
    @Column(name = "direccion", columnDefinition = "VARCHAR(255)", nullable = false)
    private String direccion;
    @Column(name = "ciudad", columnDefinition = "VARCHAR(45)", nullable = false)
    private String ciudad;
    @Column(name = "pais", columnDefinition = "VARCHAR(45)", nullable = false)
    private String pais;
    @Column(name = "descripcion", columnDefinition = "VARCHAR(255)", nullable = false)
    private String descripcion;
    @Column(name = "nacionalidad", columnDefinition = "VARCHAR(45)", nullable = false)
    private String nacionalidad;
    @Column(name = "estado_civil", columnDefinition = "VARCHAR(45)", nullable = false)
    private String estado_civil;

    //experiencia laboral
    @Column(name = "nombre_de_empresa", columnDefinition = "VARCHAR(255)")
    private String nombre_de_empresa;
    @Column(name = "cargo", columnDefinition = "VARCHAR(45)")
    private String cargo;
    @Column(name = "fecha_inicio", columnDefinition = "DATE")
    private String fecha_inicio_laboral;
    @Column(name = "fecha_fin", columnDefinition = "DATE")
    private String fecha_fin_laboral;

    //Educacion
    @Column(name = "institucion", columnDefinition = "VARCHAR(255)")
    private String institucion;
    @Column(name = "titulo", columnDefinition = "VARCHAR(45)")
    private String titulo;
    @Column(name = "fecha_inicio_estudio", columnDefinition = "DATE")
    private String fecha_inicio_estudio;
    @Column(name = "fecha_fin_estudio", columnDefinition = "DATE")
    private String fecha_fin_estudio;

    //Habilidades
    @Column(name = "habilidad", columnDefinition = "VARCHAR(255)")
    private String habilidad;

    //Idiomas
    @Column(name = "idioma", columnDefinition = "VARCHAR(45)")
    private String idioma;
    @Column(name = "nivel", columnDefinition = "VARCHAR(45)")
    private String nivel;

    //Certificaciones
    @Column(name = "certificaciones", columnDefinition = "VARCHAR(255)", nullable = false)
    private String certificaciones;
    @Column(name = "fecha_obtencion", columnDefinition = "DATE")
    private String fecha_obtencion;
    @Column(name = "institucion_obtencion", columnDefinition = "VARCHAR(255)")
    private String institucion_obtencion;
    @Column(name = "cargar_certificado", columnDefinition = "LONGBLOB")
    private byte[] cargar_certificado;

  
    @OneToOne(mappedBy = "hvd", cascade = CascadeType.ALL)
    private Personas persona;

}

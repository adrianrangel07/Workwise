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

    public int getId() {
      return id;
    }

    public void setId(int id) {
      this.id = id;
    }

    public String getNombre() {
      return nombre;
    }

    public void setNombre(String nombre) {
      this.nombre = nombre;
    }

    public String getApellido() {
      return apellido;
    }

    public void setApellido(String apellido) {
      this.apellido = apellido;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getTelefono() {
      return telefono;
    }

    public void setTelefono(String telefono) {
      this.telefono = telefono;
    }

    public String getDireccion() {
      return direccion;
    }

    public void setDireccion(String direccion) {
      this.direccion = direccion;
    }

    public String getCiudad() {
      return ciudad;
    }

    public void setCiudad(String ciudad) {
      this.ciudad = ciudad;
    }

    public String getPais() {
      return pais;
    }

    public void setPais(String pais) {
      this.pais = pais;
    }

    public String getDescripcion() {
      return descripcion;
    }

    public void setDescripcion(String descripcion) {
      this.descripcion = descripcion;
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

    public String getNombre_de_empresa() {
      return nombre_de_empresa;
    }

    public void setNombre_de_empresa(String nombre_de_empresa) {
      this.nombre_de_empresa = nombre_de_empresa;
    }

    public String getCargo() {
      return cargo;
    }

    public void setCargo(String cargo) {
      this.cargo = cargo;
    }

    public String getFecha_inicio_laboral() {
      return fecha_inicio_laboral;
    }

    public void setFecha_inicio_laboral(String fecha_inicio_laboral) {
      this.fecha_inicio_laboral = fecha_inicio_laboral;
    }

    public String getFecha_fin_laboral() {
      return fecha_fin_laboral;
    }

    public void setFecha_fin_laboral(String fecha_fin_laboral) {
      this.fecha_fin_laboral = fecha_fin_laboral;
    }

    public String getInstitucion() {
      return institucion;
    }

    public void setInstitucion(String institucion) {
      this.institucion = institucion;
    }

    public String getTitulo() {
      return titulo;
    }

    public void setTitulo(String titulo) {
      this.titulo = titulo;
    }

    public String getFecha_inicio_estudio() {
      return fecha_inicio_estudio;
    }

    public void setFecha_inicio_estudio(String fecha_inicio_estudio) {
      this.fecha_inicio_estudio = fecha_inicio_estudio;
    }

    public String getFecha_fin_estudio() {
      return fecha_fin_estudio;
    }

    public void setFecha_fin_estudio(String fecha_fin_estudio) {
      this.fecha_fin_estudio = fecha_fin_estudio;
    }

    public String getHabilidad() {
      return habilidad;
    }

    public void setHabilidad(String habilidad) {
      this.habilidad = habilidad;
    }

    public String getIdioma() {
      return idioma;
    }

    public void setIdioma(String idioma) {
      this.idioma = idioma;
    }

    public String getNivel() {
      return nivel;
    }

    public void setNivel(String nivel) {
      this.nivel = nivel;
    }

    public String getCertificaciones() {
      return certificaciones;
    }

    public void setCertificaciones(String certificaciones) {
      this.certificaciones = certificaciones;
    }

    public String getFecha_obtencion() {
      return fecha_obtencion;
    }

    public void setFecha_obtencion(String fecha_obtencion) {
      this.fecha_obtencion = fecha_obtencion;
    }

    public String getInstitucion_obtencion() {
      return institucion_obtencion;
    }

    public void setInstitucion_obtencion(String institucion_obtencion) {
      this.institucion_obtencion = institucion_obtencion;
    }

    public byte[] getCargar_certificado() {
      return cargar_certificado;
    }

    public void setCargar_certificado(byte[] cargar_certificado) {
      this.cargar_certificado = cargar_certificado;
    }

    public Personas getPersona() {
      return persona;
    }

    public void setPersona(Personas persona) {
      this.persona = persona;
    }
}

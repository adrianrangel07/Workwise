package com.proyectodeaula.proyecto_de_aula.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Ofertas")
public class Ofertas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "Titulo_puesto", columnDefinition = "Varchar(45)", nullable = false)
    String titulo_puesto;

    @Column(name = "Descripcion", columnDefinition = "Varchar(800)", nullable = false)
    String descripcion;

    @Column(name = "Duracion", columnDefinition = "Varchar(45)", nullable = false)
    String duracion;

    @Column(name = "Tipo_empleo", columnDefinition = "Varchar(45)", nullable = false)
    String tipo_empleo;

    @Column(name = "Salario", columnDefinition = "int", nullable = false)
    int salario;

    @Column(name = "Moneda", columnDefinition = "Varchar(45)", nullable = false)
    String moneda;

    @Column(name = "Periodo", columnDefinition = "Varchar(45)", nullable = false)
    String periodo;

    @Column(name = "modalidad", columnDefinition = "varchar(45)", nullable = false)
    String modalidad;

    @Column(name = "tipo_contrato", columnDefinition = "varchar(45)", nullable = false)
    String tipo_contrato;

    @Column(name = "experiencia", columnDefinition = "int", nullable = false)
    int experiencia;

    @Column(name = "nivel_educativo", columnDefinition = "varchar(50)", nullable = false)
    String nivel_educativo;

    @Column(name = "sector_oferta", columnDefinition = "varchar(50)", nullable = false)
    String sector_oferta;

    @Column(name = "habilitada", nullable = false, columnDefinition = "boolean default true")
    private Boolean habilitada = true;

    @Transient
    private boolean postulado;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresas empresa;

    @OneToMany(mappedBy = "ofertas", cascade = CascadeType.ALL)
    private List<Postulacion> postulaciones;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo_puesto() {
        return titulo_puesto;
    }

    public void setTitulo_puesto(String titulo_puesto) {
        this.titulo_puesto = titulo_puesto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getSector_oferta() {
        return sector_oferta;
    }

    public void setSector_oferta(String sector_oferta) {
        this.sector_oferta = sector_oferta;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public String getTipo_empleo() {
        return tipo_empleo;
    }

    public void setTipo_empleo(String tipo_empleo) {
        this.tipo_empleo = tipo_empleo;
    }

    public int getSalario() {
        return salario;
    }

    public void setSalario(int salario) {
        this.salario = salario;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getTipo_contrato() {
        return tipo_contrato;
    }

    public void setTipo_contrato(String tipo_contrato) {
        this.tipo_contrato = tipo_contrato;
    }

    public int getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(int experiencia) {
        this.experiencia = experiencia;
    }

    public String getNivel_educativo() {
        return nivel_educativo;
    }

    public void setNivel_educativo(String nivel_educativo) {
        this.nivel_educativo = nivel_educativo;
    }

    public boolean isPostulado() {
        return postulado;
    }

    public void setPostulado(boolean postulado) {
        this.postulado = postulado;
    }

    public Empresas getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresas empresa) {
        this.empresa = empresa;
    }

    public List<Postulacion> getPostulaciones() {
        return postulaciones;
    }

    public void setPostulaciones(List<Postulacion> postulaciones) {
        this.postulaciones = postulaciones;
    }

    public Boolean getHabilitada() {
        return habilitada;
    }

    public void setHabilitada(Boolean habilitada) {
        this.habilitada = habilitada;
    }

}

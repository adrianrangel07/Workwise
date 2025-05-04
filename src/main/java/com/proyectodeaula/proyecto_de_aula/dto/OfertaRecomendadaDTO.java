package com.proyectodeaula.proyecto_de_aula.dto;

import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class OfertaRecomendadaDTO {
    private Long idOferta;
    private String titulo;
    private String descripcion;
    private String duracion;
    private int salario;
    private String tipoEmpleo;
    private String modalidad;
    private String tipoContrato;
    private int experiencia;
    private String moneda;
    private String periodo;
    private String sector;
    private String nivelEstudio;
    private int idEmpresa;
    private String nombreEmpresa;
    private double confianza;

    public OfertaRecomendadaDTO(Ofertas oferta, double confianza) {
        this.idOferta = oferta.getId(); ;
        this.titulo = oferta.getTipo_empleo();
        this.descripcion = oferta.getDescripcion();
        this.duracion = oferta.getDuracion();
        this.salario = oferta.getSalario();
        this.tipoEmpleo = oferta.getTipo_empleo();
        this.modalidad = oferta.getModalidad();
        this.tipoContrato = oferta.getTipo_contrato();
        this.experiencia = oferta.getExperiencia();
        this.moneda = oferta.getMoneda();
        this.periodo = oferta.getPeriodo();
        this.sector = oferta.getSector_oferta();
        this.nivelEstudio = oferta.getNivel_educativo();
        this.idEmpresa = oferta.getEmpresa().getId();
        this.nombreEmpresa = oferta.getEmpresa().getNombreEmp();
        this.confianza = confianza;
    }

    public Long getIdOferta() {
        return idOferta;
    }

    public void setIdOferta(Long idOferta) {
        this.idOferta = idOferta;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
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

    public int getSalario() {
        return salario;
    }

    public void setSalario(int salario) {
        this.salario = salario;
    }

    public String getTipoEmpleo() {
        return tipoEmpleo;
    }

    public void setTipoEmpleo(String tipoEmpleo) {
        this.tipoEmpleo = tipoEmpleo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getTipoContrato() {
        return tipoContrato;
    }

    public void setTipoContrato(String tipoContrato) {
        this.tipoContrato = tipoContrato;
    }

    public int getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(int experiencia) {
        this.experiencia = experiencia;
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

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getNivelEstudio() {
        return nivelEstudio;
    }

    public void setNivelEstudio(String nivelEstudio) {
        this.nivelEstudio = nivelEstudio;
    }

    public int getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(int idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public double getConfianza() {
        return confianza;
    }

    public void setConfianza(double confianza) {
        this.confianza = confianza;
    }
}


package com.proyectodeaula.proyecto_de_aula.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class prediccion {

    private String tipoEmpleoOferta;
    private String modalidadOferta;
    private String tipoContratoOferta;
    private double experienciaRequerida;
    private String nivelEstudioRequerido;
    private String sectorOferta;
    private String tipoEmpleoDeseado;
    private String preferenciaModalidad;
    private String preferenciaContrato;
    private double experienciaPersona;
    private String nivelEstudioPersona;
    private String sectorPersona;
    private double edadPersona;
    private String coincideTipoEmpleo;
    private String coincideModalidad;
    private String coincideContrato;
    private String coincideEstudios;
    private String coincideSector;
    private String experienciaSuficiente;

    
    public String getTipoEmpleoOferta() {
        return tipoEmpleoOferta;
    }

    public void setTipoEmpleoOferta(String tipoEmpleoOferta) {
        this.tipoEmpleoOferta = tipoEmpleoOferta;
    }

    public String getModalidadOferta() {
        return modalidadOferta;
    }

    public void setModalidadOferta(String modalidadOferta) {
        this.modalidadOferta = modalidadOferta;
    }

    public String getTipoContratoOferta() {
        return tipoContratoOferta;
    }

    public void setTipoContratoOferta(String tipoContratoOferta) {
        this.tipoContratoOferta = tipoContratoOferta;
    }

    public double getExperienciaRequerida() {
        return experienciaRequerida;
    }

    public void setExperienciaRequerida(double experienciaRequerida) {
        this.experienciaRequerida = experienciaRequerida;
    }

    public String getNivelEstudioRequerido() {
        return nivelEstudioRequerido;
    }

    public void setNivelEstudioRequerido(String nivelEstudioRequerido) {
        this.nivelEstudioRequerido = nivelEstudioRequerido;
    }

    public String getSectorOferta() {
        return sectorOferta;
    }

    public void setSectorOferta(String sectorOferta) {
        this.sectorOferta = sectorOferta;
    }

    public String getTipoEmpleoDeseado() {
        return tipoEmpleoDeseado;
    }

    public void setTipoEmpleoDeseado(String tipoEmpleoDeseado) {
        this.tipoEmpleoDeseado = tipoEmpleoDeseado;
    }

    public String getPreferenciaModalidad() {
        return preferenciaModalidad;
    }

    public void setPreferenciaModalidad(String preferenciaModalidad) {
        this.preferenciaModalidad = preferenciaModalidad;
    }

    public String getPreferenciaContrato() {
        return preferenciaContrato;
    }

    public void setPreferenciaContrato(String preferenciaContrato) {
        this.preferenciaContrato = preferenciaContrato;
    }

    public double getExperienciaPersona() {
        return experienciaPersona;
    }

    public void setExperienciaPersona(double experienciaPersona) {
        this.experienciaPersona = experienciaPersona;
    }

    public String getNivelEstudioPersona() {
        return nivelEstudioPersona;
    }

    public void setNivelEstudioPersona(String nivelEstudioPersona) {
        this.nivelEstudioPersona = nivelEstudioPersona;
    }

    public String getSectorPersona() {
        return sectorPersona;
    }

    public void setSectorPersona(String sectorPersona) {
        this.sectorPersona = sectorPersona;
    }

    public double getEdadPersona() {
        return edadPersona;
    }

    public void setEdadPersona(double edadPersona) {
        this.edadPersona = edadPersona;
    }

    public String getCoincideTipoEmpleo() {
        return coincideTipoEmpleo;
    }

    public void setCoincideTipoEmpleo(String coincideTipoEmpleo) {
        this.coincideTipoEmpleo = coincideTipoEmpleo;
    }

    public String getCoincideModalidad() {
        return coincideModalidad;
    }

    public void setCoincideModalidad(String coincideModalidad) {
        this.coincideModalidad = coincideModalidad;
    }

    public String getCoincideContrato() {
        return coincideContrato;
    }

    public void setCoincideContrato(String coincideContrato) {
        this.coincideContrato = coincideContrato;
    }

    public String getCoincideEstudios() {
        return coincideEstudios;
    }

    public void setCoincideEstudios(String coincideEstudios) {
        this.coincideEstudios = coincideEstudios;
    }

    public String getCoincideSector() {
        return coincideSector;
    }

    public void setCoincideSector(String coincideSector) {
        this.coincideSector = coincideSector;
    }

    public String getExperienciaSuficiente() {
        return experienciaSuficiente;
    }

    public void setExperienciaSuficiente(String experienciaSuficiente) {
        this.experienciaSuficiente = experienciaSuficiente;
    }
}

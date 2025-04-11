package com.proyectodeaula.proyecto_de_aula.model;

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
    private int edadPersona;
    private String coincideTipoEmpleo;
    private String coincideModalidad;
    private String coincideContrato;
    private String coincideEstudios;
    private String coincideSector;
    private String experienciaSuficiente;

    // Add getters for all fields
    public String getTipoEmpleoOferta() {
        return tipoEmpleoOferta;
    }

    public String getModalidadOferta() {
        return modalidadOferta;
    }

    public String getTipoContratoOferta() {
        return tipoContratoOferta;
    }

    public double getExperienciaRequerida() {
        return experienciaRequerida;
    }

    public String getNivelEstudioRequerido() {
        return nivelEstudioRequerido;
    }

    public String getSectorOferta() {
        return sectorOferta;
    }

    public String getTipoEmpleoDeseado() {
        return tipoEmpleoDeseado;
    }

    public String getPreferenciaModalidad() {
        return preferenciaModalidad;
    }

    public String getPreferenciaContrato() {
        return preferenciaContrato;
    }

    public double getExperienciaPersona() {
        return experienciaPersona;
    }

    public String getNivelEstudioPersona() {
        return nivelEstudioPersona;
    }

    public String getSectorPersona() {
        return sectorPersona;
    }

    public int getEdadPersona() {
        return edadPersona;
    }

    public String getCoincideTipoEmpleo() {
        return coincideTipoEmpleo;
    }

    public String getCoincideModalidad() {
        return coincideModalidad;
    }

    public String getCoincideContrato() {
        return coincideContrato;
    }

    public String getCoincideEstudios() {
        return coincideEstudios;
    }

    public String getCoincideSector() {
        return coincideSector;
    }

    public String getExperienciaSuficiente() {
        return experienciaSuficiente;
    }

}

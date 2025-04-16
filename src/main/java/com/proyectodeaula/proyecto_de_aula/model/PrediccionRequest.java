package com.proyectodeaula.proyecto_de_aula.model;



import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PrediccionRequest {

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
}

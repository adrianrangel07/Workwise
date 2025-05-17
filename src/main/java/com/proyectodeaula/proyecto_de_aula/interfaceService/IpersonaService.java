package com.proyectodeaula.proyecto_de_aula.interfaceService;

import java.util.List;
import java.util.Optional;

import com.proyectodeaula.proyecto_de_aula.model.Personas;

public interface IpersonaService {
    public List<Personas> listar();

    public Optional<Personas> listarId(Long id);

    public int save(Personas U);

    void eliminarPersona(Long id);

    Optional<Personas> obtenerPersonaPorId(Long id);
    
    void actualizarEstadoVerificacion(String email, boolean verificado);
}

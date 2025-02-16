package com.proyectodeaula.proyecto_de_aula.interfaceService;

import com.proyectodeaula.proyecto_de_aula.model.Personas;
import java.util.List;
import java.util.Optional;

public interface IpersonaService {
    public List<Personas>listar();
    public Optional<Personas>listarId(int id);
    public int save(Personas U);
    public void delete (int Id);
}

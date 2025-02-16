package com.proyectodeaula.proyecto_de_aula.interfaceService;

import com.proyectodeaula.proyecto_de_aula.model.Postulacion;
import java.util.List;
import java.util.Optional;

public interface IpostulacionService{
    public List<Postulacion>listar();
    public Optional<Postulacion>listarId(int id);
    public int save(Postulacion P);
    public void delete (int Id);
}
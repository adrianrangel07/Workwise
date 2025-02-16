package com.proyectodeaula.proyecto_de_aula.interfaceService;

import java.util.List;
import java.util.Optional;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;

public interface IempresaService {
    public List<Empresas>listar_Emp();
    public Optional<Empresas>listarId(int id);
    public int save(Empresas E);
    public void delete (int Id);
}

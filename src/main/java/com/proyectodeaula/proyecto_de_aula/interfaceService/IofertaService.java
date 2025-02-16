package com.proyectodeaula.proyecto_de_aula.interfaceService;

import java.util.List;
import java.util.Optional;

import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;

public interface IofertaService {
    public List<Ofertas>listar_ofertas();
    public Optional<Ofertas>listarId(int id);
    public int save(Ofertas O);
    public void delete (long Id);
    List<Ofertas> listarOfertasPorEmpresa(Empresas empresa);
    public void update(long id, Ofertas updatedOffer);
    public Ofertas findById(long id);
}

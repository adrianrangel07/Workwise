package com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Ofertas;

@Repository
public interface Interfaz_ofertas extends CrudRepository<Ofertas, Integer> {

    @Query("SELECT o FROM Ofertas o WHERE o.titulo_puesto LIKE %:termino%")
    List<Ofertas> findByTituloPuestoContaining(@Param("termino") String termino);

    List<Ofertas> findByHabilitadaTrue();
}

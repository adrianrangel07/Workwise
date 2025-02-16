package com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;

@Repository
public interface OfertasRepository extends JpaRepository<Ofertas, Long> {
    List<Ofertas> findByEmpresa(Empresas empresa);
}

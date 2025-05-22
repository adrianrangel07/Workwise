package com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;

@Repository
public interface OfertasRepository extends JpaRepository<Ofertas, Long> {

        List<Ofertas> findByEmpresa(Empresas empresa);

        Page<Ofertas> findByEmpresa(Empresas empresa, Pageable pageable);

        Page<Ofertas> findAllByOrderByIdDesc(Pageable pageable);

        long countByHabilitada(boolean b);

        Page<Ofertas> findByHabilitadaTrue(Pageable pageable);

        @Query("SELECT o FROM Ofertas o WHERE " +
                        "LOWER(o.titulo_puesto) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
                        "LOWER(o.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
        Page<Ofertas> findByTituloPuestoContainingIgnoreCaseOrDescripcionContainingIgnoreCase(
                        @Param("termino") String termino1,
                        @Param("termino") String termino2,
                        Pageable pageable);
}

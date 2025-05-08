package com.proyectodeaula.proyecto_de_aula.interfaces.Empresas;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyectodeaula.proyecto_de_aula.model.Empresas;

public interface Interfaz_Emp extends JpaRepository<Empresas, Integer> {

    Empresas findByEmailAndContraseña(String email, String contraseña);

    Empresas findByEmail(String email);

    Optional<Empresas> findById(Long empresaId);

    @Query(value = "SELECT * FROM empresas ORDER BY id DESC LIMIT 3", nativeQuery = true)
    List<Empresas> findTopNByOrderByIdDesc(int limit);

    @Query("SELECT e FROM Empresas e WHERE "
            + "LOWER(e.nombreEmp) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "CAST(e.nit AS string) LIKE CONCAT('%', :query, '%') OR "
            + "LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Empresas> buscarPorNombreNitOEmail(@Param("query") String query, Pageable pageable);

}

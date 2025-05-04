package com.proyectodeaula.proyecto_de_aula.interfaces.Personas;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyectodeaula.proyecto_de_aula.model.Personas;

public interface Interfaz_Per extends JpaRepository<Personas, Long> {

    Personas findByEmailAndContraseña(String Email, String Contraseña);

    Personas findByEmail(String email);

    @Query(value = "SELECT * FROM Personas ORDER BY id DESC LIMIT 3", nativeQuery = true)
    List<Personas> findTopNByOrderByIdDesc(int i);

    @Query("SELECT p FROM Personas p WHERE "
            + "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(p.apellido) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "p.identificacion LIKE CONCAT('%', :query, '%')")
    Page<Personas> buscarPorNombreEmailOIdentificacion(@Param("query") String query, Pageable pageable);
}

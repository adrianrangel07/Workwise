package com.proyectodeaula.proyecto_de_aula.interfaces.Personas;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.proyectodeaula.proyecto_de_aula.model.Personas;

public interface Interfaz_Per extends JpaRepository<Personas, Long> {

    Personas findByEmailAndContraseña(String Email, String Contraseña);

    Personas findByEmail(String email);

    @Query("SELECT p FROM Personas p ORDER BY p.id DESC")
    List<Personas> findTopNByOrderByIdDesc(int i);
}

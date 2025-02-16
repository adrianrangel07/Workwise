package com.proyectodeaula.proyecto_de_aula.interfaces.Personas;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectodeaula.proyecto_de_aula.model.Personas;


public interface Interfaz_Per extends JpaRepository<Personas, Integer>{
    Personas findByEmailAndContraseña(String Email, String Contraseña);
    Personas findByEmail(String email);
    Optional<Personas> findById(Long usuarioId);
}

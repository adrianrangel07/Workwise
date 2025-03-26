package com.proyectodeaula.proyecto_de_aula.interfaces.Personas;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectodeaula.proyecto_de_aula.model.Personas;


public interface Interfaz_Per extends JpaRepository<Personas, Long>{
    Personas findByEmailAndContraseña(String Email, String Contraseña);
    Personas findByEmail(String email);
    
}

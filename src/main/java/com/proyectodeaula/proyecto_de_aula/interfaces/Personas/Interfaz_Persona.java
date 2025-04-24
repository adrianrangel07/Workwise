package com.proyectodeaula.proyecto_de_aula.interfaces.Personas;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Personas;


@Repository
public interface Interfaz_Persona extends CrudRepository <Personas, Integer>{
    
}



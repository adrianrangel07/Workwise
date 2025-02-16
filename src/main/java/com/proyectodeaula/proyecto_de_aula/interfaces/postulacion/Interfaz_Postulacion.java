package com.proyectodeaula.proyecto_de_aula.interfaces.postulacion;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Postulacion;


@Repository
public interface Interfaz_Postulacion extends CrudRepository <Postulacion, Integer>{
}


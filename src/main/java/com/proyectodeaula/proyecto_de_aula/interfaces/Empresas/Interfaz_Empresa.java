package com.proyectodeaula.proyecto_de_aula.interfaces.Empresas;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;

@Repository
public interface Interfaz_Empresa extends CrudRepository <Empresas, Integer> {  
}

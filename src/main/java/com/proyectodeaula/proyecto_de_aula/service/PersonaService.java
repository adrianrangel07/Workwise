package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IpersonaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Persona;
import com.proyectodeaula.proyecto_de_aula.model.Personas;

@Service
public class PersonaService implements IpersonaService {

    @Autowired
    private Interfaz_Persona data;

    @Autowired
    private Interfaz_Per user;

    @Override
    public List<Personas> listar() {
        return (List<Personas>) data.findAll();
    }

    @Override
    public Optional<Personas> listarId(int id) {
        throw new UnsupportedOperationException("Unimplemented method 'listarId'");
    }

    @Override
    public int save(Personas U) {
        int res = 0;
        Personas Usu = data.save(U);
        if (Usu != null) {  // Corrección de la comparación
            res = 1;
        }
        return res;
    }
    
    @Override
    public void delete(int Id) {
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    public Personas findByEmail(String email) {
        return user.findByEmail(email);
    }

    public void actualizarPerfil(Personas persona) throws Exception {
        Personas per = user.findByEmail(persona.getEmail());
        if (per == null) {
            throw new Exception("Usuario no encontrado");
        }

        per.setNombre(persona.getNombre());
        per.setApellido(persona.getApellido());
        per.setContraseña(persona.getContraseña());
        per.setGenero(persona.getGenero());
        per.setEmail(persona.getEmail());

        user.save(per);
    }

    public void eliminarHojaDeVida(String email) throws Exception {
        Personas persona = user.findByEmail(email);
        if (persona == null) {
            throw new Exception("Usuario no encontrado");
        }

        persona.setCv(null);
        user.save(persona);
    }
}

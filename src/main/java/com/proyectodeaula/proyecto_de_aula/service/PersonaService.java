package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<Personas> listar() {
        return (List<Personas>) data.findAll();
    }

    @Override
    public Optional<Personas> listarId(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'listarId'");
    }

    @Override
    public int save(Personas U) {
        int res = 0;

        U.setContraseña(passwordEncoder.encode(U.getContraseña()));

        Personas Usu = data.save(U);
        if (Usu != null) {
            res = 1;
        }
        return res;
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

        if (persona.getContraseña() != null && !persona.getContraseña().isEmpty()) {
            if (!persona.getContraseña().startsWith("$2a$10$")) { 
                System.out.println("Encriptando nueva contraseña...");
                per.setContraseña(passwordEncoder.encode(persona.getContraseña()));
            } else {
                System.out.println("La contraseña ya está encriptada, no se encripta de nuevo.");
                per.setContraseña(persona.getContraseña());
            }
        }

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

    @Override
    public void eliminarPersona(Long id) { // Cambiamos int -> Long
        if (!user.existsById(id)) {
            throw new RuntimeException("El usuario no existe.");
        }
        user.deleteById(id);
    }

}

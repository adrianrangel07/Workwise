package com.proyectodeaula.proyecto_de_aula.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IpersonaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Persona;
import com.proyectodeaula.proyecto_de_aula.model.Personas;

import jakarta.transaction.Transactional;

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
    public void eliminarPersona(Long id) { 
        if (!user.existsById(id)) {
            throw new RuntimeException("El usuario no existe.");
        }
        user.deleteById(id);
    }

    public long contarUsuarios() {
        return user.count();
    }

    public List<Personas> obtenerUsuariosRecientes(int i) {
        return user.findTopNByOrderByIdDesc(i);
    }

    public Map<String, Object> obtenerUsuariosPaginados(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Personas> pageResult = user.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("usuarios", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());

        return response;
    }

    public void cambiarEstadoUsuario(Long id) {
        Personas usuario = user.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        user.save(usuario);
    }

    public Page<Personas> listarUsuariosPaginados(Pageable pageable) {
        return user.findAll(pageable);
    }

    @Override
    public Optional<Personas> obtenerPersonaPorId(Long id) {
        return user.findById(id);
    }

    public Personas guardarPersona(Personas persona) {
        return user.save(persona);
    }

    public Page<Personas> buscarUsuarios(String query, Pageable pageable) {
        return user.buscarPorNombreEmailOIdentificacion(query, pageable);
    }

    @Override
    @Transactional
    public void actualizarEstadoVerificacion(String email, boolean verificado) {
        user.actualizarEstadoVerificacion(email, verificado);
    }
}

package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IempresaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Emp;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Empresa;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;

@Service
public class EmpresaService implements IempresaService {

    @Autowired
    private Interfaz_Empresa dataemp;

    @Autowired
    private Interfaz_Emp Emp;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<Empresas> listar_Emp() {
        return (List<Empresas>) dataemp.findAll();
    }

    @Override
    public Optional<Empresas> listarId(int id) {
        throw new UnsupportedOperationException("Unimplemented method 'listarId'");
    }

    @Override
    public int save(Empresas E) {
        int res = 0;
        Empresas emp = dataemp.save(E);

        E.setContraseña(passwordEncoder.encode(E.getContraseña()));

        if (emp != null) {
            res = 1;
        }

        return res;
    }

    @Override
    public void delete(int Id) {
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    public Empresas findByEmail(String email) {
        return Emp.findByEmail(email);
    }

    public void actualizarPerfil(Empresas empresa) throws Exception {
        // Busca la empresa en la base de datos por su email
        Empresas emp = Emp.findByEmail(empresa.getEmail());
        if (emp == null) {
            throw new Exception("Empresa no encontrada");
        }

        // Actualiza los campos básicos
        emp.setNombreEmp(empresa.getNombreEmp());
        emp.setDireccion(empresa.getDireccion());
        emp.setRazon_social(empresa.getRazon_social());
        emp.setEmail(empresa.getEmail());

        // Encriptar contraseña solo si es nueva o no está encriptada
        if (empresa.getContraseña() != null && !empresa.getContraseña().isEmpty()) {
            if (!empresa.getContraseña().startsWith("$2a$10$")) {
                System.out.println("Encriptando nueva contraseña...");
                emp.setContraseña(passwordEncoder.encode(empresa.getContraseña()));
            } else {
                System.out.println("La contraseña ya está encriptada, no se encripta de nuevo.");
                emp.setContraseña(empresa.getContraseña());
            }
        }

        // Guarda los cambios
        Emp.save(emp);
    }

}

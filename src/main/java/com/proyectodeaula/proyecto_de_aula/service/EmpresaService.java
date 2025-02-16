package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
        Empresas emp = dataemp.save(E); // Guardar empresa

        if (emp != null) { // Verificar si el guardado fue exitoso
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
        // Busca el usuario en la base de datos por su email
        Empresas emp = Emp.findByEmail(empresa.getEmail());
        if (emp == null) {
            throw new Exception("Usuario no encontrado");
        }

        emp.setNombreEmp(empresa.getNombreEmp());
        emp.setDireccion(empresa.getDireccion());
        emp.setContraseña(empresa.getContraseña());
        emp.setEmail(empresa.getEmail());
        emp.setRazon_social(empresa.getRazon_social());

        Emp.save(emp);
    }
}

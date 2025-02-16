package com.proyectodeaula.proyecto_de_aula.model;


import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "Empresas")
public class Empresas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	int id;
	// columna de nombre de la empresa
	@Column(name = "NombreEmp", columnDefinition = "varchar(45)", nullable = false)
	String nombreEmp;
	// Columna de direccion de la empresa
	@Lob
	@Column(name = "Direccion", columnDefinition = "LONGBLOB", nullable = false)
	String direccion;
	// Columna de Razon_social de la empresa
	@Column(name = "Razon_social", columnDefinition = "varchar(45)", nullable = false)
	String razon_social;
	// Columna de nit de la empresa
	@Column(name = "nit", columnDefinition = "int", nullable = false)
	int nit;
	// Columna correo electronico para iniciar sesion la empresa
	@Column(name = "email", columnDefinition = "VARCHAR(45)", nullable = false)
	String email;
	// Columna contraseña para iniciar sesion la empresa
	@Column(name = "contraseña", columnDefinition = "VARCHAR(45)", nullable = false)
	String contraseña;

	@OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ofertas> ofertas = new ArrayList<>();

	public Empresas() {
	}



	public Empresas(int id, String nombreEmp, String direccion, String razon_social, int nit, String email,
			String contraseña, List<Ofertas> ofertas) {
		this.id = id;
		this.nombreEmp = nombreEmp;
		this.direccion = direccion;
		this.razon_social = razon_social;
		this.nit = nit;
		this.email = email;
		this.contraseña = contraseña;
		this.ofertas = ofertas;
	}




	public int getId() {
		return id;
	}




	public void setId(int id) {
		this.id = id;
	}




	public String getNombreEmp() {
		return nombreEmp;
	}




	public void setNombreEmp(String nombreEmp) {
		this.nombreEmp = nombreEmp;
	}




	public String getDireccion() {
		return direccion;
	}




	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}




	public String getRazon_social() {
		return razon_social;
	}




	public void setRazon_social(String razon_social) {
		this.razon_social = razon_social;
	}




	public int getNit() {
		return nit;
	}




	public void setNit(int nit) {
		this.nit = nit;
	}




	public String getEmail() {
		return email;
	}




	public void setEmail(String email) {
		this.email = email;
	}




	public String getContraseña() {
		return contraseña;
	}




	public void setContraseña(String contraseña) {
		this.contraseña = contraseña;
	}




	public List<Ofertas> getOfertas() {
		return ofertas;
	}




	public void setOfertas(List<Ofertas> ofertas) {
		this.ofertas = ofertas;
	}




	
}

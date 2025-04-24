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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Empresas")
public class Empresas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	int id;
	
	// columna de nombre de la empresa
	@Column(name = "NombreEmp", columnDefinition = "varchar(45)", nullable = false)
	String nombreEmp;
	// Columna de direccion de la empresa
	@Column(name = "Direccion", columnDefinition = "varchar(255)", nullable = false)
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
	@Column(name = "contraseña", columnDefinition = "VARCHAR(300)", nullable = false)
	String contraseña;

	@Lob
	@Column(name = "foto", columnDefinition = "LONGBLOB")
	private byte[] foto;

	@OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ofertas> ofertas = new ArrayList<>();

}

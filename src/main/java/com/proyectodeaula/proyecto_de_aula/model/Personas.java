package com.proyectodeaula.proyecto_de_aula.model;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "Personas")
public class Personas {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "Nombre", columnDefinition = "VARCHAR(45)", nullable = false)
	private String nombre;

	@Column(name = "Apellido", columnDefinition = "VARCHAR(45)", nullable = false)
	private String apellido;

	@Column(name = "email", columnDefinition = "VARCHAR(45)", nullable = false)
	private String email;

	@Column(name = "contraseña", columnDefinition = "VARCHAR(255)", nullable = false)
	private String contraseña;

	@Column(name = "Cedula", columnDefinition = "VARCHAR(20)", nullable = false)
	private String identificacion;

	@Column(name = "tipo_identificacion", columnDefinition = "VARCHAR(20)", nullable = false)
	private String tipoIdentificacion;

	@Column(name = "fecha_nacimiento", columnDefinition = "date", nullable = false)
	private Date fecha_nacimiento;

	@Column(name = "genero", columnDefinition = "VARCHAR(20)", nullable = false)
	private String genero;

	@Lob
	@Column(name = "foto", columnDefinition = "LONGBLOB")
	private byte[] foto;

	@Lob
	@Column(name = "cv", columnDefinition = "LONGBLOB")
	private byte[] cv;

	@OneToMany(mappedBy = "personas", cascade = CascadeType.ALL)
	private List<Postulacion> postulaciones;

	@OneToOne
	@JoinColumn(name = "HvD_id")
	private HvD hvd;

}


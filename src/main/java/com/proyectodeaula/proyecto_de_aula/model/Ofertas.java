package com.proyectodeaula.proyecto_de_aula.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Ofertas")
public class Ofertas {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "Titulo_puesto", columnDefinition = "Varchar(45)", nullable = false)
    String titulo_puesto;

    @Column(name = "Descripcion", columnDefinition = "Varchar(800)", nullable = false)
    String descripcion;

    @Column(name = "Duracion", columnDefinition = "Varchar(45)", nullable = false)
    String duracion;

    //@Column(name = "tiempo", columnDefinition = "TIME", nullable = false)
    //java.sql.Time tiempo;

    @Column(name = "Tipo_empleo", columnDefinition = "Varchar(45)", nullable = false)
    String tipo_empleo;

    @Column(name = "Salario", columnDefinition = "int", nullable = false)
    int salario;

    @Column(name = "Moneda", columnDefinition = "Varchar(45)", nullable = false) 
    String moneda;

    @Column(name = "Periodo", columnDefinition = "Varchar(45)", nullable = false)
    String periodo;

    @Column(name = "modalidad", columnDefinition = "varchar(45)", nullable = false)
    String modalidad;

    @Column(name = "tipo_contrato", columnDefinition = "varchar(45)", nullable = false)
    String tipo_contrato;

    @Column(name = "experiencia", columnDefinition = "int", nullable = false)
    int experiencia;

    @Column(name = "nivel_educativo", columnDefinition = "varchar(50)", nullable = false)
    String nivel_educativo;

    @Transient
    private boolean postulado;

    @ManyToOne
    @JoinColumn(name = "empresa_id") 
    private Empresas empresa;

    @OneToMany(mappedBy = "ofertas", cascade = CascadeType.ALL)
    private List<Postulacion> postulaciones;
    
}

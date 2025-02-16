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

@Entity
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

    @Column(name = "Tipo_empleo", columnDefinition = "Varchar(45)", nullable = false)
    String tipo_empleo;

    @Column(name = "Salario", columnDefinition = "int", nullable = false)
    int salario;

    @Column(name = "Moneda", columnDefinition = "Varchar(10)", nullable = false) 
    String moneda;

    @Column(name = "Periodo", columnDefinition = "Varchar(45)", nullable = false)
    String periodo;

    @Column(name = "modalidad", columnDefinition = "varchar(45)", nullable = false)
    String modalidad;

    @Column(name = "tipo_contrato", columnDefinition = "varchar(45)", nullable = false)
    String tipo_contrato;

    @ManyToOne
    @JoinColumn(name = "empresa_id") // Asegúrate de que el nombre de la columna sea correcto
    private Empresas empresa;

    @OneToMany(mappedBy = "ofertas", cascade = CascadeType.ALL)
    private List<Postulacion> postulaciones;
    
    public Ofertas(){
    }

    public Ofertas(Long id, String titulo_puesto, String descripcion, String duracion, String tipo_empleo, int salario,
            String moneda, String periodo, String modalidad, String tipo_contrato, Empresas empresa,
            List<Postulacion> postulaciones) {
        this.id = id;
        this.titulo_puesto = titulo_puesto;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.tipo_empleo = tipo_empleo;
        this.salario = salario;
        this.moneda = moneda;
        this.periodo = periodo;
        this.modalidad = modalidad;
        this.tipo_contrato = tipo_contrato;
        this.empresa = empresa;
        this.postulaciones = postulaciones;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public Empresas getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresas empresa) {
        this.empresa = empresa;
    }

    public String getTitulo_puesto() {
        return titulo_puesto;
    }

    public void setTitulo_puesto(String titulo_puesto) {
        this.titulo_puesto = titulo_puesto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public String getTipo_empleo() {
        return tipo_empleo;
    }

    public void setTipo_empleo(String tipo_empleo) {
        this.tipo_empleo = tipo_empleo;
    }

    public int getSalario() {
        return salario;
    }

    public void setSalario(int salario) {
        this.salario = salario;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getTipo_contrato() {
        return tipo_contrato;
    }

    public void setTipo_contrato(String tipo_contrato) {
        this.tipo_contrato = tipo_contrato;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Postulacion> getPostulaciones() {
        return postulaciones;
    }

    public void setPostulaciones(List<Postulacion> postulaciones) {
        this.postulaciones = postulaciones;
    }


}

package com.proyectodeaula.proyecto_de_aula.interfaces.postulacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
    Postulacion findById(int id);
    Postulacion findByPersonas(Personas persona);
    public Postulacion findByPersonasAndOfertas(Personas persona, Ofertas oferta);

    Optional<Postulacion> findByOfertasIdAndPersonasId(Long ofertaId, Long usuarioId);
    List<Postulacion> findByPersonasId(Long personaId);
}

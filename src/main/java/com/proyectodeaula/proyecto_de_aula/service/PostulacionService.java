package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IpostulacionService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.OfertasRepository;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.Interfaz_Postulacion;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.PostulacionRepository;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;

@Service
public class PostulacionService implements IpostulacionService {

    @Autowired
    private Interfaz_Postulacion data;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Autowired
    private Interfaz_Per personaRepository;

    @Autowired
    private OfertasRepository ofertaRepository;

    @Override
    public List<Postulacion> listar() {
        return (List<Postulacion>) data.findAll();
    }

    @Override
    public Optional<Postulacion> listarId(int id) {
        throw new UnsupportedOperationException("Unimplemented method 'listarId'");
    }

    @Override
    public int save(Postulacion P) {
        int res = 0;
        Postulacion Pos = data.save(P);
        if (Pos != null) {  // Evita el NullPointerException
            res = 1;
        }
        return res;
    }

    public void savePostulacion(Long ofertaId, Long personaId) {
        // Buscar la oferta y la persona usando sus IDs
        Optional<Ofertas> ofertaOpt = ofertaRepository.findById(ofertaId);
        Optional<Personas> personaOpt = personaRepository.findById(personaId);

        // Verificar que tanto la oferta como la persona existan
        if (ofertaOpt.isPresent() && personaOpt.isPresent()) {
            Ofertas oferta = ofertaOpt.get();
            Personas persona = personaOpt.get();

            // Crear una nueva postulación
            Postulacion postulacion = new Postulacion();
            postulacion.setOfertas(oferta); // Asignar la oferta
            postulacion.setPersonas(persona); // Asignar la persona
            postulacion.setN_personas(1); // Aquí puedes definir la cantidad de personas postuladas, dependiendo de tu
            // lógica

            // Guardar la postulación
            postulacionRepository.save(postulacion);
        } else {
            // Manejo de error si no se encuentran la oferta o la persona
            throw new RuntimeException("Oferta o persona no encontrados");
        }
    }

    public List<Postulacion> obtenerPostulacionesPorUsuario(Long personaId) {
        return postulacionRepository.findByPersonasId(personaId);
    }

    @Override
    public void delete(int Id) {
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    public void eliminarPostulacion(Long id) {
        postulacionRepository.deleteById(id);
    }

    public boolean actualizarEstado(Long id, String nuevoEstado) {
        Optional<Postulacion> postulacionOpt = postulacionRepository.findById(id);
        if (postulacionOpt.isPresent()) {
            Postulacion postulacion = postulacionOpt.get();
            postulacion.setEstado(nuevoEstado);
            postulacionRepository.save(postulacion);
            return true;
        }
        return false;
    }

    public long contarPostulaciones() {
        return postulacionRepository.count();
    }

}

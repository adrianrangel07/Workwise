package com.proyectodeaula.proyecto_de_aula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IofertaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.Interfaz_ofertas;
import com.proyectodeaula.proyecto_de_aula.interfaces.Ofertas.OfertasRepository;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.PostulacionRepository;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OfertaService implements IofertaService {

    private static final Logger logger = LoggerFactory.getLogger(OfertaService.class);

    @Autowired
    private Interfaz_ofertas oferr;

    @Autowired
    public OfertasRepository ofertaRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @Override
    public List<Ofertas> listar_ofertas() {
        return oferr.findByHabilitadaTrue();
    }

    @Override
    public Optional<Ofertas> listarId(int id) {
        throw new UnsupportedOperationException("Unimplemented method 'listarId'");
    }

    @Override
    public int save(Ofertas O) {
        if (O.getHabilitada() == null) {
            O.setHabilitada(true);
        }
        int res = 0;
        Ofertas Usu = oferr.save(O);  // Guardar oferta en la base de datos
        if (Usu != null) {
            res = 1;
        }
        return res;
    }

    @Override
    public void delete(long id) {
        ofertaRepository.deleteById(id);
    }

    @Override
    public List<Ofertas> listarOfertasPorEmpresa(Empresas empresa) {
        return ofertaRepository.findByEmpresa(empresa);
    }

    public List<Ofertas> buscarOfertasPorTermino(String termino) {
        return oferr.findByTituloPuestoContaining(termino);
    }

    @Override
    public Ofertas findById(long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void update(long id, Ofertas updatedOffer) {
        Ofertas existingOffer = ofertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Oferta no encontrada con id: " + id));

        // Actualizar solo campos permitidos
        existingOffer.setTitulo_puesto(updatedOffer.getTitulo_puesto());
        existingOffer.setDescripcion(updatedOffer.getDescripcion());
        existingOffer.setSalario(updatedOffer.getSalario());
        existingOffer.setMoneda(updatedOffer.getMoneda());
        existingOffer.setDuracion(updatedOffer.getDuracion());
        existingOffer.setPeriodo(updatedOffer.getPeriodo());
        existingOffer.setModalidad(updatedOffer.getModalidad());
        existingOffer.setTipo_empleo(updatedOffer.getTipo_empleo());
        existingOffer.setTipo_contrato(updatedOffer.getTipo_contrato());
        existingOffer.setExperiencia(updatedOffer.getExperiencia());
        existingOffer.setNivel_educativo(updatedOffer.getNivel_educativo());
        existingOffer.setSector_oferta(updatedOffer.getSector_oferta());

        ofertaRepository.save(existingOffer);
        logger.info("Oferta actualizada ID: {}", id);
    }

    public int obtenerNumeroPostulaciones(long idOferta) {
        // Obtener la oferta
        Optional<Ofertas> ofertaOpt = ofertaRepository.findById(idOferta);
        if (ofertaOpt.isPresent()) {
            Ofertas oferta = ofertaOpt.get();
            return oferta.getPostulaciones() != null ? oferta.getPostulaciones().size() : 0;
        }
        return 0;
    }

    public List<Personas> obtenerPostulantesPorOferta(long idOferta) {
        List<Postulacion> postulaciones = postulacionRepository.findByOfertasId(idOferta);
        return postulaciones.stream()
                .map(Postulacion::getPersonas)
                .collect(Collectors.toList());
    }

    public List<Postulacion> obtenerPostulacionesPorOferta(long idOferta) {
        return postulacionRepository.findByOfertasId(idOferta);
    }

    @Override
    public Page<Ofertas> listar_ofertas_paginadas(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ofertaRepository.findByHabilitadaTrue(pageable);
    }

    @Override
    public Page<Ofertas> listarOfertasPorEmpresaPaginado(Empresas empresa, Pageable pageable) {
        return ofertaRepository.findByEmpresa(empresa, pageable);
    }

    @Override
    public void toggleHabilitar(long id) {
        Ofertas offer = findById(id);
        if (offer.getHabilitada() == null) {
            offer.setHabilitada(false);
        } else {
            offer.setHabilitada(!offer.getHabilitada());
        }
        ofertaRepository.save(offer);
    }

    @Override
    public List<Ofertas> listarTodasOfertasPorEmpresa(Empresas empresa) {
        return ofertaRepository.findByEmpresa(empresa);
    }

    @Override
    public Page<Ofertas> listarTodasOfertasPorEmpresaPaginado(Empresas empresa, Pageable pageable) {
        return ofertaRepository.findByEmpresa(empresa, pageable);
    }

    public long contarOfertasActivas() {
        return ofertaRepository.countByHabilitada(true); 
    }

    public List<Ofertas> obtenerOfertasRecientes(int i) {
        Pageable pageable = PageRequest.of(0, i);
        Page<Ofertas> ofertasRecientes = ofertaRepository.findAllByOrderByIdDesc(pageable);
        return ofertasRecientes.getContent();
    }

    public long contarPostulaciones() {
        return postulacionRepository.count();
    }
}

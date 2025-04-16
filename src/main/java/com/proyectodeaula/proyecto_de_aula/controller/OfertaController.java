package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IofertaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.postulacion.PostulacionRepository;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.service.OfertaService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping
public class OfertaController {

    @Autowired
    private IofertaService offerService;

    @Autowired
    private OfertaService offerta;

    @Autowired
    private Interfaz_Per personaRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;

    @GetMapping("/personas/pagina_principal")
    public String listar_ofertas_1(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size, Model model, HttpSession session) {

        Long usuarioId = (Long) session.getAttribute("usuarioId");
        if (usuarioId == null) {
            return "redirect:/login/personas";
        }

        Optional<Personas> personaOptional = personaRepository.findById(usuarioId);
        model.addAttribute("persona", personaOptional.orElse(new Personas()));

        Page<Ofertas> ofertasPage = offerService.listar_ofertas_paginadas(page, size);
        List<Ofertas> Ofertas = ofertasPage.getContent();

        // Obtener las ofertas postuladas por el usuario
        List<Long> ofertasPostuladas = postulacionRepository.findOfertasIdsByPersonaId(usuarioId);

        // Marcar las ofertas postuladas
        Ofertas.forEach(oferta -> {
            oferta.setPostulado(ofertasPostuladas.contains(oferta.getId()));
        });

        model.addAttribute("Ofertas", Ofertas);
        model.addAttribute("paginaActual", page);
        model.addAttribute("totalPaginas", ofertasPage.getTotalPages());
        model.addAttribute("size", size);
        model.addAttribute("usuarioId", usuarioId);

        return "Html/persona/pagina_principal_personas";
    }

    @GetMapping("/pagina/inicio")
    public String listar_ofertas(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size, Model model) {

        Page<Ofertas> ofertasPage = offerService.listar_ofertas_paginadas(page, size);

        List<Ofertas> Ofertas = ofertasPage.getContent();

        model.addAttribute("paginaActual", page);
        model.addAttribute("totalPaginas", ofertasPage.getTotalPages());
        model.addAttribute("Ofertas", Ofertas);
        return "Html/pagina_principal";
    }

    @GetMapping("/buscar_ofertas")
    @ResponseBody
    public List<Ofertas> buscarOfertas(@RequestParam("termino") String termino) {
        return offerta.buscarOfertasPorTermino(termino);
    }

    @PostMapping("/guardarOferta")
    public String guardarOferta(@ModelAttribute Ofertas oferta, HttpSession session) {
        Empresas empresa = (Empresas) session.getAttribute("empresa");
        oferta.setEmpresa(empresa); // Establecer la empresa para la oferta
        offerService.save(oferta); // Guarda la oferta usando el servicio
        return "redirect:/empresas/pagina_principal"; // Redirige a la página principal
    }

    @DeleteMapping("/offers/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOffer(@PathVariable long id) {
        offerService.delete(id); // Llama al servicio con el `id` como `long`
    }

    @PutMapping("/offers/edit/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateOffer(@PathVariable long id, @RequestBody Ofertas updatedOffer) {
        offerService.update(id, updatedOffer); // Llamada al servicio para actualizar la oferta
    }

    @GetMapping("/ofertas/{idOferta}/postulaciones/count")
    public ResponseEntity<Integer> obtenerPostulacionesCount(@PathVariable long idOferta) {
        try {
            int count = offerta.obtenerNumeroPostulaciones(idOferta);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}

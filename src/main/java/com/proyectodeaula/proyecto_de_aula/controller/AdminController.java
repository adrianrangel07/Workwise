package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.service.EmpresaService;
import com.proyectodeaula.proyecto_de_aula.service.OfertaService;
import com.proyectodeaula.proyecto_de_aula.service.PersonaService;
import com.proyectodeaula.proyecto_de_aula.service.PostulacionService;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminController {

    @Autowired
    private PersonaService personaService;

    @Autowired
    private OfertaService ofertaService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private PostulacionService postulacionService;

    @GetMapping("/admin/dashboard")
    public String showAdminDashboard(HttpSession session, Model model) {
        // Verificar si el usuario es administrador
        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }

        // Obtener estadísticas
        long totalUsuarios = personaService.contarUsuarios();
        long totalOfertas = ofertaService.contarOfertasActivas();
        long totalPostulaciones = postulacionService.contarPostulaciones();
        long totalEmpresas = empresaService.contarEmpresas();

        // Obtener actividad reciente
        List<Personas> usuariosRecientes = personaService.obtenerUsuariosRecientes(5);
        List<Ofertas> ofertasRecientes = ofertaService.obtenerOfertasRecientes(5);

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("totalOfertas", totalOfertas);
        model.addAttribute("totalPostulaciones", totalPostulaciones);
        model.addAttribute("totalEmpresas", totalEmpresas);
        model.addAttribute("usuariosRecientes", usuariosRecientes);
        model.addAttribute("ofertasRecientes", ofertasRecientes);

        return "Html/Admin/dashboard";
    }

    @GetMapping("/admin/usuarios")
    public String gestionUsuarios(HttpSession session, Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }
        return "Html/Admin/usuarios";
    }

    @GetMapping("/admin/ofertas")
    public String gestionOfertas(HttpSession session, Model model) {
        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }

        List<Ofertas> ofertas = ofertaService.listar_ofertas();
        model.addAttribute("ofertas", ofertas);

        return "Html/Admin/ofertas";
    }

    @GetMapping("/admin/logout")
    public String adminLogout(HttpSession session) {
        session.removeAttribute("isAdmin");
        session.removeAttribute("adminEmail");
        return "redirect:/login/personas?adminLogout=true";
    }

    
}

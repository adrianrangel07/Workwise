package com.proyectodeaula.proyecto_de_aula.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;
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

    @Autowired
    private Interfaz_Per user;

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
        List<Personas> usuariosRecientes = personaService.obtenerUsuariosRecientes(3);
        List<Ofertas> ofertasRecientes = ofertaService.obtenerOfertasRecientes(3);
        List<Empresas> empresasRecientes = empresaService.obtenerEmpresasRecientes(3);

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("totalOfertas", totalOfertas);
        model.addAttribute("totalPostulaciones", totalPostulaciones);
        model.addAttribute("totalEmpresas", totalEmpresas);
        model.addAttribute("usuariosRecientes", usuariosRecientes);
        model.addAttribute("ofertasRecientes", ofertasRecientes);
        model.addAttribute("empresasRecientes", empresasRecientes);

        return "Html/Admin/dashboard";
    }

    @GetMapping("/admin/usuarios")
    public String gestionUsuarios(HttpSession session, Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }

        // Obtener estadísticas
        long totalUsuarios = personaService.contarUsuarios();

        // Obtener lista de usuarios paginada
        Page<Personas> usuariosPage = personaService.listarUsuariosPaginados(PageRequest.of(page, size));
        List<Personas> usuarios = usuariosPage.getContent();

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", usuariosPage.getTotalPages());

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

    @GetMapping("/admin/empresas")
    public String gestionEmpresas(HttpSession session, Model model) {
        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }

        List<Empresas> empresas = empresaService.listar_Emp();
        model.addAttribute("empresas", empresas);

        return "Html/Admin/empresas";
    }

    @GetMapping("/admin/logout")
    public String adminLogout(HttpSession session) {
        session.invalidate(); // Invalida toda la sesión completamente
        return "redirect:/login/personas?logoutSuccess"; // Redirige con parámetro
    }

    @PostMapping("/admin/usuarios/delete/{id}")
    public String eliminarUsuario(@PathVariable Long id,
            RedirectAttributes redirectAttributes) {

        try {
            personaService.eliminarPersona(id);
            redirectAttributes.addFlashAttribute("success", "Usuario eliminado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar usuario: " + e.getMessage());
        }

        return "redirect:/admin/usuarios";
    }

    @PutMapping("/usuarios/{id}/desactivar")
    @ResponseBody
    public ResponseEntity<Map<String, String>> desactivarUsuario(@PathVariable Long id) {
        Optional<Personas> usuario = user.findById(id);
        if (usuario.isPresent()) {
            Personas u = usuario.get();
            u.setActivo(!u.isActivo()); // Cambia el estado actual
            user.save(u);

            return ResponseEntity.ok()
                    .body(Map.of("message", "Estado del usuario actualizado correctamente",
                            "newStatus", u.isActivo() ? "Activo" : "Inactivo"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }
    }

    @GetMapping("/admin/usuarios/buscar")
    public String buscarUsuarios(
            HttpSession session,
            Model model,
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (session.getAttribute("isAdmin") == null) {
            return "redirect:/login/personas";
        }

        Page<Personas> usuariosPage = personaService.buscarUsuarios(query, PageRequest.of(page, size));

        model.addAttribute("usuarios", usuariosPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", usuariosPage.getTotalPages());
        model.addAttribute("totalUsuarios", usuariosPage.getTotalElements());
        model.addAttribute("searchQuery", query); // Para mantener el término de búsqueda

        return "Html/Admin/usuarios";
    }
}

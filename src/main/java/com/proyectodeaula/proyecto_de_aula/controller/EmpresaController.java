package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IofertaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Emp;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Empresa;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.service.EmpresaService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping
public class EmpresaController {

    private static final Logger logger = LoggerFactory.getLogger(EmpresaController.class);

    // Inyección de dependencias para acceder a los servicios y repositorios
    @Autowired
    private Interfaz_Emp uEmp;

    @Autowired
    private Interfaz_Empresa empresaRepository;

    @Autowired
    private IofertaService ofertaService;

    @Autowired
    private EmpresaService empresaService;

    // Muestra el formulario de registro de empresa
    @GetMapping("/Registrar/Empresa")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("empresa", new Empresas());
        return "html/Registrar_empresa";
    }

    // Registra una nueva empresa en la base de datos
    @PostMapping("/Registrar/Empresa")
    public String registrarEmpresa(@ModelAttribute Empresas empresa) {
        empresaRepository.save(empresa);
        return "redirect:/login/Empresa";
    }

    // Muestra la página de inicio de sesión para empresas
    @GetMapping("/login/Empresa")
    public String mostrarLoginEmpresa() {
        return "html/inicio_sesion_empresa";
    }

    // Procesa el inicio de sesión de una empresa
    @PostMapping("/login/Empresa")
    public String iniciarSesion(HttpSession session, Model model, @RequestParam String email, @RequestParam String contraseña) {
        Empresas empresa = uEmp.findByEmailAndContraseña(email, contraseña);

        if (empresa != null) {
            session.setAttribute("email", email);
            session.setAttribute("empresa", empresa);
            session.setAttribute("usuarioId", empresa.getId());
            return "redirect:/empresas/pagina_principal";
        }
        model.addAttribute("error", "Credenciales incorrectas o empresa no encontrada");
        return "redirect:/datos_incorrectaemp";
    }

    // Muestra la página principal de la empresa después del inicio de sesión
    @GetMapping("/empresas/pagina_principal")
    public String mostrarPaginaPrincipal(Model model, HttpSession session) {
        Empresas empresa = (Empresas) session.getAttribute("empresa");
        if (empresa != null) {
            model.addAttribute("Ofertas", ofertaService.listarOfertasPorEmpresa(empresa));
            model.addAttribute("nombreEmpresa", empresa.getNombreEmp());
            return "html/pagina_principal_empresa";
        }
        return "redirect:/login/Empresa";
    }

    // Muestra la página de error en caso de credenciales incorrectas
    @GetMapping("/datos_incorrectaemp")
    public String mostrarErrorLogin() {
        return "html/contraseña_incorrectaemp";
    }

    // Muestra el perfil de la empresa
    @GetMapping("/perfil/empresa")
    public String mostrarPerfil(Model model, HttpSession session) {
        String email = (String) session.getAttribute("email");
        Empresas empresa = empresaService.findByEmail(email);

        if (empresa == null) {
            model.addAttribute("error", "Empresa no encontrada.");
            return "html/error";
        }
        model.addAttribute("empresa", empresa);
        return "html/Mi_perfilemp";
    }

    // Actualiza el perfil de la empresa
    @PostMapping("/actualizar/empresa")
    public String actualizarPerfil(@RequestParam String nombreEmp, @RequestParam String direccion,
            @RequestParam String contraseña, @RequestParam String razonSocial,
            HttpSession session, Model model) {
        // Verifica si la sesión sigue activa
        String email = (String) session.getAttribute("email");
        if (email == null) {
            model.addAttribute("error", "Sesión expirada, por favor inicie sesión de nuevo.");
            return "redirect:/login/Empresa";
        }

        // Busca la empresa en la base de datos
        Empresas empresa = empresaService.findByEmail(email);
        if (empresa == null) {
            model.addAttribute("error", "Empresa no encontrada.");
            return "html/error";
        }

        try {
            // Actualiza los datos de la empresa si no están vacíos
            if (!nombreEmp.isEmpty()) {
                empresa.setNombreEmp(nombreEmp);
            }
            if (!direccion.isEmpty()) {
                empresa.setDireccion(direccion);
            }
            if (!contraseña.isEmpty()) {
                empresa.setContraseña(contraseña);
            }
            if (!razonSocial.isEmpty()) {
                empresa.setRazon_social(razonSocial);
            }

            // Guarda los cambios en la base de datos
            empresaService.actualizarPerfil(empresa);
            return "redirect:/perfil/empresa";
        } catch (Exception e) {
            model.addAttribute("error", "Error al actualizar el perfil: " + e.getMessage());
            return "html/error";
        }
    }

    @PostMapping("/empresas/upload/photo")
    public String uploadPhoto(@RequestParam("file") MultipartFile file, HttpSession session) {
        String email = (String) session.getAttribute("email");
        Empresas empresa = empresaService.findByEmail(email);
        if (empresa != null) {
            try {
                empresa.setFoto(file.getBytes());
                uEmp.save(empresa);
            } catch (IOException e) {
                logger.error("Error al subir la foto", e);
            }
        }
        return "redirect:/perfil/empresa";
    }

    // Muestra la vista de estadísticas de empresas
    @GetMapping("/Estadisticas/empresas")
    public String mostrarEstadisticas() {
        return "html/Estadisticas_empresas";
    }

    @GetMapping("/empresas/oferta") // para ver las ofertas postuladas
        public String oferta() {
        return "html/Oferta";
    }

    @GetMapping("/Contraseña-olvidada-empresa") // cuando quieren recuperar la contraseña de la cuenta de empresa
        public String olvidar_emp() {
        return "html/contraseña_olvidada_emp";
    }

    @GetMapping("/empresas/published offers") // cuando quieren recuperar la contraseña de la cuenta de empresa
        public String recuperar_emp() {
        return "html/ofertas-publicadas";
    }
}

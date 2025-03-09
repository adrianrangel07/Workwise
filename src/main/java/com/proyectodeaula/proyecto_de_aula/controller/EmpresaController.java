package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
        return "Html/Empresa/Registrar_empresa";
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
        return "Html/Empresa/inicio_sesion_empresa";
    }

    // Procesa el inicio de sesión de una empresa
    @PostMapping("/login/Empresa")
    public String iniciarSesion(HttpSession session, Model model, @RequestParam String email,
            @RequestParam String contraseña) {
        Empresas empresa = uEmp.findByEmailAndContraseña(email, contraseña);

        if (empresa != null) {
            session.setAttribute("email", email);
            session.setAttribute("empresa", empresa);
            session.setAttribute("usuarioId", empresa.getId());
            return "redirect:/empresas/pagina_principal";
        }
        model.addAttribute("error", "Credenciales incorrectas o empresa no encontrada");
        return "redirect:/login/Empresa?error=true";
    }

    // Muestra la página principal de la empresa después del inicio de sesión
    @GetMapping("/empresas/pagina_principal")
    public String mostrarPaginaPrincipal(Model model, HttpSession session) {
        Empresas empresa = (Empresas) session.getAttribute("empresa");
        if (empresa != null) {
            model.addAttribute("Ofertas", ofertaService.listarOfertasPorEmpresa(empresa));
            model.addAttribute("nombreEmpresa", empresa.getNombreEmp());
            model.addAttribute("empresa", empresa); // Asegurando que Thymeleaf tenga acceso al objeto empresa
            return "Html/Empresa/pagina_principal_empresa";
        }
        return "redirect:/login/Empresa";
    }

    // Muestra el perfil de la empresa
    @GetMapping("/perfil/empresa")
    public String mostrarPerfil(Model model, HttpSession session) {
        String email = (String) session.getAttribute("email");
        Empresas empresa = empresaService.findByEmail(email);

        if (empresa == null) {
            model.addAttribute("error", "Empresa no encontrada.");
            return "Html/error";
        }
        model.addAttribute("empresa", empresa);
        return "Html/Empresa/Mi_perfilemp";
    }

    @PostMapping("/verificar-contrasena")
    public ResponseEntity<Map<String, Boolean>> verificarContrasena(
            @RequestBody Map<String, String> requestBody, HttpSession session) {

        String email = (String) session.getAttribute("email");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valido", false));
        }

        Empresas empresa = empresaService.findByEmail(email);
        if (empresa == null || !empresa.getContraseña().equals(requestBody.get("password"))) {
            return ResponseEntity.ok(Map.of("valido", false)); // Contraseña incorrecta
        }

        return ResponseEntity.ok(Map.of("valido", true)); // Contraseña correcta
    }

    // Actualiza el perfil de la empresa
    @PostMapping("/actualizar/empresa")
    public String actualizarPerfil(
            @RequestParam String nombreEmp,
            @RequestParam String direccion,
            @RequestParam String razon_social,
            @RequestParam String confirmPassword, 
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
            return "Html/error";
        }

        try {
            // Actualiza los datos de la empresa si no están vacíos
            if (!nombreEmp.isEmpty()) {
                empresa.setNombreEmp(nombreEmp);
            }
            if (!direccion.isEmpty()) {
                empresa.setDireccion(direccion);
            }
            if (!razon_social.isEmpty()) {
                empresa.setRazon_social(razon_social);
            }

            // Guarda los cambios en la base de datos
            empresaService.actualizarPerfil(empresa);
            return "redirect:/perfil/empresa";
        } catch (Exception e) {
            model.addAttribute("error", "Error al actualizar el perfil: " + e.getMessage());
            return "Html/error";
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

    @GetMapping("/empresas/photo")
    public ResponseEntity<byte[]> getPhoto(HttpSession session) {
        String email = (String) session.getAttribute("email");
        Empresas empresa = empresaService.findByEmail(email);

        if (empresa == null || empresa.getFoto() == null) {
            return ResponseEntity.notFound().build(); // Si no hay foto, retorna 404
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Cambia el tipo si usas PNG u otro formato

        return new ResponseEntity<>(empresa.getFoto(), headers, HttpStatus.OK);
    }

    @GetMapping("/Empresa/imagen/{id}")
    public ResponseEntity<byte[]> obtenerImagenEmpresa(@PathVariable Long id) {
        Optional<Empresas> empresa = uEmp.findById(id);

        if (empresa.isPresent() && empresa.get().getFoto() != null) {
            byte[] imagen = empresa.get().getFoto();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Ajusta según el formato guardado
            return new ResponseEntity<>(imagen, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Muestra la vista de estadísticas de empresas
    @GetMapping("/Estadisticas/empresas")
    public String mostrarEstadisticas(HttpSession session, Model model) {
        Empresas empresa = (Empresas) session.getAttribute("empresa"); // Obtener la empresa desde la sesión

        if (empresa == null) {
            return "redirect:/login/Empresa"; // Redirigir al login si no hay empresa en sesión
        }

        model.addAttribute("empresa", empresa); // Agregar la empresa al modelo

        return "Html/Empresa/Estadisticas_empresas";
    }

    @GetMapping("/empresas/published-offers") // Para ver las ofertas publicadas
    public String publishedoffers(HttpSession session, Model model) {
        Empresas empresa = (Empresas) session.getAttribute("empresa");
        if (empresa != null) {
            model.addAttribute("Ofertas", ofertaService.listarOfertasPorEmpresa(empresa));
            model.addAttribute("nombreEmpresa", empresa.getNombreEmp());
            model.addAttribute("empresa", empresa); // Asegurando que Thymeleaf tenga acceso al objeto empresa
            return "Html/Empresa/ofertas-publicadas";
        }
        return "redirect:/login/Empresa";
    }

    @GetMapping("/Contraseña-olvidada-empresa") // cuando quieren recuperar la contraseña de la cuenta de empresa
    public String olvidar_emp() {
        return "Html/Empresa/contraseña_olvidada_emp";
    }

    @GetMapping("/empresas/oferta") // para ver las ofertas postuladas
    public String oferta() {
        return "Html/Empresa/Oferta";
    }

}

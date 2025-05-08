package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.proyectodeaula.proyecto_de_aula.interfaceService.IofertaService;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Emp;
import com.proyectodeaula.proyecto_de_aula.interfaces.Empresas.Interfaz_Empresa;
import com.proyectodeaula.proyecto_de_aula.model.Empresas;
import com.proyectodeaula.proyecto_de_aula.model.Ofertas;
import com.proyectodeaula.proyecto_de_aula.service.EmpresaService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping
public class EmpresaController {

    private static final Logger logger = LoggerFactory.getLogger(EmpresaController.class);

    @Autowired
    private Interfaz_Emp uEmp;

    @Autowired
    private Interfaz_Empresa empresaRepository;

    @Autowired
    private IofertaService ofertaService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Muestra el formulario de registro de empresa
    @GetMapping("/Registrar/Empresa")
    public String mostrarFormularioRegistro(Model model) {
        Empresas empresa = new Empresas();
        model.addAttribute("empresa", empresa);
        return "Html/Empresa/Registrar_empresa";
    }

    // Registra una nueva empresa en la base de datos
    @PostMapping("/Registrar/Empresa")
    public String registrarEmpresa(@ModelAttribute Empresas empresa, Model model) {
        String contraseña = empresa.getContraseña();
        if (contraseña == null || contraseña.isBlank()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }

        empresa.setContraseña(passwordEncoder.encode(empresa.getContraseña()));
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
    public String iniciarSesionEmpresa(HttpSession session, Model model,
            @RequestParam String email, RedirectAttributes redirectAttributes,
            @RequestParam String contraseña) {

        Empresas empresa = uEmp.findByEmail(email);

        if (empresa == null) {
            System.out.println("No se encontró empresa con el email: " + email);
            model.addAttribute("error", "Credenciales incorrectas");
            return "redirect:/login/Empresa?error=true";
        }

        if (!empresa.isActivo()) {
            redirectAttributes.addAttribute("desactivada", true);
            return "redirect:/login/personas";
        }

        System.out.println("Empresa encontrada: " + empresa.getEmail());
        System.out.println("Contraseña en BD: " + empresa.getContraseña());
        System.out.println("Contraseña ingresada: " + contraseña);

        if (passwordEncoder.matches(contraseña, empresa.getContraseña())) {
            System.out.println("Contraseña correcta, iniciando sesión...");
            session.setAttribute("email", email);
            session.setAttribute("empresa", empresa);
            session.setAttribute("usuarioId", empresa.getId());
            session.setAttribute("loginSuccess", "true");
            return "redirect:/empresas/pagina_principal";
        } else {
            System.out.println("Contraseña incorrecta");
            model.addAttribute("error", "Credenciales incorrectas");
            return "redirect:/login/Empresa?error=true";
        }
    }

    // Muestra la página principal de la empresa después del inicio de sesión
    @GetMapping("/empresas/pagina_principal")
    public String listarOfertasEmpresa(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            Model model,
            HttpSession session) {

        Empresas empresa = (Empresas) session.getAttribute("empresa");
        if (empresa == null) {
            return "redirect:/login/Empresa";
        }

        // Obtener ofertas paginadas de la empresa
        Page<Ofertas> ofertasPage = ofertaService.listarOfertasPorEmpresaPaginado(empresa, PageRequest.of(page, size));

        // Depuración: Verificar el estado de habilitación
        ofertasPage.getContent().forEach(oferta -> {
            System.out.println("Oferta ID: " + oferta.getId() + " - Habilitada: " + oferta.getHabilitada());
        });

        model.addAttribute("Ofertas", ofertasPage.getContent());
        model.addAttribute("empresa", empresa);
        model.addAttribute("paginaActual", page);
        model.addAttribute("totalPaginas", ofertasPage.getTotalPages());
        model.addAttribute("size", size);

        return "Html/Empresa/pagina_principal_empresa";
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

        byte[] imagen;

        try {
            if (empresa != null && empresa.getFoto() != null) {
                imagen = empresa.getFoto();
            } else {
                // Cargar imagen por defecto desde static/Imagenes/imagenempresa.png
                ClassPathResource defaultImage = new ClassPathResource("static/Imagenes/imagenempresa.png");
                imagen = Files.readAllBytes(defaultImage.getFile().toPath());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG); // Cambia a IMAGE_JPEG si la imagen es JPG

            return new ResponseEntity<>(imagen, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
        return "Html/Empresa/contrasena_olvidada_emp";
    }

    @GetMapping("/empresas/oferta") // para ver las ofertas postuladas
    public String oferta() {
        return "Html/Empresa/Oferta";
    }

    @PostMapping("/verificar-correo-emp")
    public ResponseEntity<String> verificarCorreo(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        Empresas empresas = empresaService.findByEmail(email);

        if (empresas == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO_REGISTRADO");
        }

        return ResponseEntity.ok("Correo verificado. Ahora puede cambiar su contraseña.");
    }

    @PostMapping("/cambiar-contrasena-emp")
    public ResponseEntity<String> cambiarContraseña(@RequestBody Map<String, String> requestData) throws Exception {
        String email = requestData.get("email");
        String nuevaContraseña = requestData.get("nuevaContraseña");

        Empresas empresas = empresaService.findByEmail(email);
        if (empresas == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ERROR");
        }

        empresas.setContraseña(passwordEncoder.encode(nuevaContraseña)); // ✅ Encriptar antes de guardar
        empresaService.actualizarPerfil(empresas);
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/verificar-contrasena-eliminar")
    public ResponseEntity<Map<String, Boolean>> verificarContrasenaEliminar(
            @RequestBody Map<String, String> requestBody, HttpSession session) {

        String email = (String) session.getAttribute("email");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valido", false));
        }

        Empresas empresa = empresaService.findByEmail(email);
        if (empresa == null) {
            return ResponseEntity.ok(Map.of("valido", false));
        }

        boolean contraseñaValida = empresaService.verificarContraseña(empresa.getId(), requestBody.get("password"));
        return ResponseEntity.ok(Map.of("valido", contraseñaValida));
    }

    @PostMapping("/eliminar-cuenta-empresa")
    public ResponseEntity<String> eliminarCuentaEmpresa(
            @RequestBody Map<String, String> requestBody, HttpSession session) {

        String email = (String) session.getAttribute("email");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sesión expirada");
        }

        Empresas empresa = empresaService.findByEmail(email);
        if (empresa == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empresa no encontrada");
        }

        // Verificar contraseña nuevamente por seguridad
        boolean contraseñaValida = empresaService.verificarContraseña(
                empresa.getId(), requestBody.get("password"));

        if (!contraseñaValida) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Contraseña incorrecta");
        }

        try {
            // 1. Eliminar todas las ofertas de la empresa primero
            List<Ofertas> ofertas = ofertaService.listarOfertasPorEmpresa(empresa);
            for (Ofertas oferta : ofertas) {
                ofertaService.delete(oferta.getId());
            }

            // 2. Eliminar la cuenta de la empresa
            empresaService.delete(empresa.getId());

            // 3. Invalidar la sesión
            session.invalidate();

            return ResponseEntity.ok("Cuenta eliminada exitosamente");
        } catch (Exception e) {
            logger.error("Error al eliminar cuenta de empresa", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la cuenta");
        }
    }

}

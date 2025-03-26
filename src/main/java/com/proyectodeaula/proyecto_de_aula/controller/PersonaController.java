package com.proyectodeaula.proyecto_de_aula.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Per;
import com.proyectodeaula.proyecto_de_aula.interfaces.Personas.Interfaz_Persona;
import com.proyectodeaula.proyecto_de_aula.model.Personas;
import com.proyectodeaula.proyecto_de_aula.model.Postulacion;
import com.proyectodeaula.proyecto_de_aula.service.PersonaService;
import com.proyectodeaula.proyecto_de_aula.service.PostulacionService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping
public class PersonaController {

    private static final Logger logger = LoggerFactory.getLogger(PersonaController.class);

    @Autowired
    private Interfaz_Per user;

    @Autowired
    private Interfaz_Persona per;

    @Autowired
    private PersonaService personaService;

    @Autowired
    private PostulacionService postulacionService;

    @GetMapping("/Register/personas")
    public String agregar(Model model) {
        Personas persona = new Personas();
        model.addAttribute("new_persona", persona);
        return "Html/persona/Registrar_persona";
    }

    @PostMapping("/Register/personas")
    public String save(@ModelAttribute("new_persona") Personas persona, Model model) {
        per.save(persona);
        return "Html/persona/inicio_sesion_persona";
    }

    @GetMapping("/login/personas")
    public String iniciar_sesion() {
        return "Html/persona/inicio_sesion_persona";
    }

    @PostMapping("/login/personas")
    public String iniciarSesion(HttpSession session, Model model, @RequestParam String email,
            @RequestParam String contraseña) {

        Personas persona = user.findByEmailAndContraseña(email, contraseña);
        if (persona != null) {
            session.setAttribute("email", email);
            session.setAttribute("usuarioId", persona.getId());
            session.setAttribute("loginSuccess", "true");
            return "redirect:/personas/pagina_principal";
        } else {
            model.addAttribute("error", "Credenciales incorrectas");
            return "redirect:/login/personas?error=true";
        }
    }

    //hola
    @PostMapping("/eliminarLoginSuccess")
    @ResponseBody
    public void eliminarLoginSuccess(HttpSession session) {
        session.removeAttribute("loginSuccess");
    }

    @GetMapping("/perfil/persona")
    public String myProfile(Model model, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null) {
            Personas persona = personaService.findByEmail(email);
            if (persona == null) {
                model.addAttribute("error", "Persona no encontrada.");
                return "Html/error";
            }

            if (persona.getFoto() != null) {
                String base64Image = Base64.getEncoder().encodeToString(persona.getFoto());
                model.addAttribute("base64Image", "data:image/png;base64," + base64Image);
            } else {
                model.addAttribute("base64Image", "");
            }
            model.addAttribute("persona", persona);
            return "Html/persona/Mi_perfil";
        } else {
            return "redirect:/login/personas";
        }
    }

    @PostMapping("/actualizar")
    public String actualizarPerfil(
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String genero,
            @RequestParam String confirmPassword,
            HttpSession session, Model model) {

        // Verifica si la sesión sigue activa
        String email = (String) session.getAttribute("email");
        if (email == null) {
            model.addAttribute("error", "Sesión expirada, por favor inicie sesión de nuevo.");
            return "redirect:/login/personas";
        }

        // Busca la persona en la base de datos
        Personas persona = personaService.findByEmail(email);
        if (persona == null) {
            model.addAttribute("error", "Usuario no encontrado.");
            return "Html/error";
        }

        try {
            // Actualiza los datos si no están vacíos
            if (!nombre.isEmpty()) {
                persona.setNombre(nombre);
            }
            if (!apellido.isEmpty()) {
                persona.setApellido(apellido);
            }
            if (!genero.isEmpty()) {
                persona.setGenero(genero);
            }

            // Guarda los cambios en la base de datos
            personaService.actualizarPerfil(persona);
            return "redirect:/perfil/persona";
        } catch (Exception e) {
            model.addAttribute("error", "Error al actualizar el perfil: " + e.getMessage());
            return "Html/error";
        }
    }

    @PostMapping("/upload/photo")
    public String uploadPhoto(@RequestParam("file") MultipartFile file, HttpSession session) {
        String email = (String) session.getAttribute("email");
        Personas persona = personaService.findByEmail(email);
        if (persona != null) {
            try {
                persona.setFoto(file.getBytes());
                per.save(persona);
            } catch (IOException e) {
                logger.error("Error al subir la foto", e);
            }
        }
        return "redirect:/perfil/persona";
    }

    // mostrar la imagen al lado del perfil
    @GetMapping("/imagen/{id}")
    public ResponseEntity<byte[]> obtenerImagen(HttpSession session) {
        String email = (String) session.getAttribute("email");
        Personas persona = personaService.findByEmail(email);

        if (persona != null && persona.getFoto() != null) {
            byte[] imagen = persona.getFoto();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // Ajusta según el formato guardado
            return new ResponseEntity<>(imagen, headers, HttpStatus.OK);
        } else {
            try {
                // Cargar la imagen por defecto desde el classpath (resources/static/Imagenes/)
                InputStream inputStream = new ClassPathResource("static/Imagenes/imagenperfil.png").getInputStream();
                byte[] imagenPorDefecto = inputStream.readAllBytes();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_PNG); // Ajusta según el tipo de imagen por defecto
                return new ResponseEntity<>(imagenPorDefecto, headers, HttpStatus.OK);
            } catch (IOException e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PostMapping("/uploadHDV")
    public ResponseEntity<?> uploadHDV(@RequestParam("file") MultipartFile file, HttpSession session) {
        try {
            if (file.isEmpty() || file.getOriginalFilename() == null
                    || !Objects.requireNonNull(file.getOriginalFilename()).toLowerCase().endsWith(".pdf")) {
                return ResponseEntity.badRequest().body("Por favor, seleccione un archivo PDF válido.");
            }

            String email = (String) session.getAttribute("email");
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Sesión expirada. Inicie sesión nuevamente.");
            }

            Personas persona = personaService.findByEmail(email);
            if (persona == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
            }

            persona.setCv(file.getBytes());
            personaService.actualizarPerfil(persona);

            return ResponseEntity.ok("PDF subido correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cargar el PDF.");
        }
    }

    @GetMapping("/perfil/verHDV")
    public ResponseEntity<byte[]> verHDV(HttpSession session) {
        String email = (String) session.getAttribute("email");
        Personas persona = personaService.findByEmail(email);

        if (persona == null || persona.getCv() == null) {
            return ResponseEntity.notFound().build();
        }

        // Crear encabezados para el contenido PDF
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.inline().filename("HDV.pdf").build());

        return ResponseEntity.ok().headers(headers).body(persona.getCv());
    }

    @PostMapping("/eliminarHDV")
    public ResponseEntity<?> eliminarHojaDeVida(HttpSession session) {
        try {
            String email = (String) session.getAttribute("email");
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Sesión expirada. Inicie sesión nuevamente.");
            }

            personaService.eliminarHojaDeVida(email);
            return ResponseEntity.ok("Hoja de vida eliminada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la hoja de vida.");
        }
    }

    @PostMapping("/verificar-correo")
    public ResponseEntity<String> verificarCorreo(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        Personas persona = personaService.findByEmail(email);

        if (persona == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO_REGISTRADO");
        }

        return ResponseEntity.ok("Correo verificado. Ahora puede cambiar su contraseña.");
    }

    @GetMapping("/persona/Postulaciones")
    public String postulaciones(Model model, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null) {
            Personas persona = personaService.findByEmail(email);
            if (persona == null) {
                model.addAttribute("error", "Persona no encontrada.");
                return "Html/error";
            }

            // Obtener postulaciones del usuario
            List<Postulacion> postulaciones = postulacionService.obtenerPostulacionesPorUsuario(persona.getId());
            model.addAttribute("postulaciones", postulaciones);

            model.addAttribute("persona", persona);
            return "Html/persona/Postulaciones";
        } else {
            return "redirect:/login/personas";
        }
    }

    @PostMapping("/verificar-contrasena/persona")
    public ResponseEntity<Map<String, Boolean>> verificarContrasena(
            @RequestBody Map<String, String> requestBody, HttpSession session) {

        String email = (String) session.getAttribute("email");
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valido", false));
        }

        Personas personas = personaService.findByEmail(email);
        if (personas == null || !personas.getContraseña().equals(requestBody.get("password"))) {
            return ResponseEntity.ok(Map.of("valido", false)); // Contraseña incorrecta
        }

        return ResponseEntity.ok(Map.of("valido", true)); // Contraseña correcta
    }

    @DeleteMapping("/eliminar-cuenta")
    public ResponseEntity<String> eliminarCuenta(HttpSession session) {
        String email = (String) session.getAttribute("email");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sesión expirada. Inicie sesión nuevamente.");
        }

        Personas persona = personaService.findByEmail(email);

        if (persona == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        try {
            personaService.eliminarPersona(persona.getId());
            session.invalidate(); // Cerrar sesión después de eliminar la cuenta
            return ResponseEntity.ok("Cuenta eliminada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la cuenta.");
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // Cerrar sesión manualmente
        return "redirect:/login/personas?logout=true"; // Redirigir al login
    }

    @GetMapping("/Nosotros") // ruta para enviar a nosotros (informacion sobre la pagina )
    public String Nosotros() {
        return "Html/Nosotros";
    }

    @GetMapping("/Estadisticas") // ruta para llevarlo a estadisticas sobre lo que podemos mostrar
    public String estadistica() {
        return "Html/Estadisticas";
    }

    @GetMapping("/Estadisticas/personas") // ruta para llevarlo a estadisticas sobre lo que podemos mostrar
    public String estadistica_persona() {
        return "Html/persona/Estadisticas_persona";
    }

    @GetMapping("/Contrasena-olvidada") // ruta para cuando quieren volver a recordar la contraseña
    public String olvidar() {
        return "Html/persona/contrasena_olvidada_per";
    }

    @GetMapping("/configuracion/persona") // ruta para configuracion de las personas
    public String configuracion() {
        return "Html/persona/Configuracion";
    }

}

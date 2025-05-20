document.addEventListener("DOMContentLoaded", function() {
    // Inicializar
    generarCaptcha();
    
    // Validación en tiempo real del email
    document.getElementById("email").addEventListener("input", function() {
        validateEmail();
    });
    
    // Validación en tiempo real de las contraseñas
    document.getElementById("nuevaContraseña").addEventListener("input", function() {
        validatePassword();
        checkPasswordMatch();
    });
    
    document.getElementById("repetirContraseña").addEventListener("input", function() {
        checkPasswordMatch();
    });
});

function generarCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Mejorar legibilidad eliminando caracteres similares (O/0, I/1, etc.)
    captcha = captcha.replace(/[O0]/g, '2').replace(/[I1]/g, '3');
    
    document.getElementById("captchaText").innerText = captcha;
}

function validateEmail() {
    const email = document.getElementById("email").value;
    const emailValidation = document.getElementById("emailValidation");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailValidation.textContent = "";
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailValidation.textContent = "Por favor ingresa un correo electrónico válido";
        emailValidation.style.color = "var(--error-color)";
        return false;
    } else {
        emailValidation.textContent = "✓ Correo válido";
        emailValidation.style.color = "var(--success-color)";
        return true;
    }
}

function validatePassword() {
    const password = document.getElementById("nuevaContraseña").value;
    const strengthBar = document.getElementById("passwordStrength");
    
    if (!password) {
        strengthBar.className = "password-strength";
        return;
    }
    
    // Calcular fortaleza
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // Actualizar barra visual
    if (password.length < 6) {
        strengthBar.className = "password-strength weak";
    } else if (strength < 3) {
        strengthBar.className = "password-strength medium";
    } else {
        strengthBar.className = "password-strength strong";
    }
}

function checkPasswordMatch() {
    const password = document.getElementById("nuevaContraseña").value;
    const confirmPassword = document.getElementById("repetirContraseña").value;
    const matchMessage = document.getElementById("passwordMatch");
    
    if (!password || !confirmPassword) {
        matchMessage.textContent = "";
        return false;
    }
    
    if (password === confirmPassword) {
        matchMessage.textContent = "✓ Las contraseñas coinciden";
        matchMessage.style.color = "var(--success-color)";
        return true;
    } else {
        matchMessage.textContent = "✗ Las contraseñas no coinciden";
        matchMessage.style.color = "var(--error-color)";
        return false;
    }
}

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling;
    
    if (field.type === "password") {
        field.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        field.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

async function validarCaptcha() {
    const captchaIngresado = document.getElementById("captchaInput").value.trim();
    const captchaCorrecto = document.getElementById("captchaText").innerText;
    const email = document.getElementById("email").value.trim();
    
    // Validar campos vacíos
    if (!email) {
        Swal.fire("Error", "Por favor ingresa tu correo electrónico", "error");
        return;
    }
    
    if (!captchaIngresado) {
        Swal.fire("Error", "Por favor ingresa el código de seguridad", "error");
        return;
    }
    
    // Validar formato de email
    if (!validateEmail()) {
        Swal.fire("Error", "Por favor ingresa un correo electrónico válido", "error");
        return;
    }
    
    if (captchaIngresado !== captchaCorrecto) {
        Swal.fire({
            title: "Código incorrecto",
            text: "El código de seguridad no coincide. Por favor inténtalo de nuevo.",
            icon: "error",
            confirmButtonText: "Entendido"
        });
        generarCaptcha();
        return;
    }
    
    // Mostrar carga
    Swal.fire({
        title: "Verificando",
        html: "Estamos verificando tu correo electrónico...",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        const response = await fetch("/verificar-correo-emp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        
        const data = await response.text();
        
        Swal.close();
        
        if (data === "NO_REGISTRADO") {
            const result = await Swal.fire({
                title: "Correo no registrado",
                text: "No encontramos una cuenta asociada a este correo. ¿Deseas registrarte?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, ir al registro",
                cancelButtonText: "No, intentar otro correo"
            });
            
            if (result.isConfirmed) {
                window.location.href = "/Registrar/Empresa";
            } else {
                document.getElementById("email").focus();
            }
        } else {
            // Mostrar siguiente paso
            document.getElementById("passwordForm").classList.remove("active");
            document.getElementById("resetForm").classList.add("active");
            document.getElementById("step1").classList.remove("active");
            document.getElementById("step2").classList.add("active");
            
            // Enfocar el primer campo de contraseña
            document.getElementById("nuevaContraseña").focus();
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema verificando el correo. Por favor intenta nuevamente.", "error");
        console.error("Error:", error);
    }
}

async function cambiarContrasena() {
    const nuevaContraseña = document.getElementById("nuevaContraseña").value;
    const repetirContraseña = document.getElementById("repetirContraseña").value;
    const email = document.getElementById("email").value;
    
    // Validaciones
    if (!nuevaContraseña || !repetirContraseña) {
        Swal.fire("Error", "Por favor completa ambos campos de contraseña", "error");
        return;
    }
    
    if (nuevaContraseña.length < 8) {
        Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
        return;
    }
    
    if (!checkPasswordMatch()) {
        Swal.fire("Error", "Las contraseñas no coinciden", "error");
        return;
    }
    
    // Mostrar carga
    Swal.fire({
        title: "Procesando",
        html: "Estamos actualizando tu contraseña...",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    try {
        const response = await fetch("/cambiar-contrasena-emp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, nuevaContraseña })
        });
        
        const data = await response.text();
        
        if (data === "OK") {
            Swal.fire({
                title: "¡Contraseña actualizada!",
                text: "Tu contraseña ha sido cambiada exitosamente.",
                icon: "success",
                confirmButtonText: "Iniciar sesión"
            }).then(() => {
                window.location.href = "/login/Empresa";
            });
        } else {
            Swal.fire("Error", "Hubo un problema al cambiar la contraseña. Por favor intenta nuevamente.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un error en la solicitud. Por favor verifica tu conexión e intenta nuevamente.", "error");
        console.error("Error:", error);
    }
}
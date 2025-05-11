// Variables de estado globales
let verificationTimer;
let isEmailVerified = false;
let currentEmail = "";
let verificationModal = null;

// Configuración inicial cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function () {
    // Configuración del calendario
    setupDatePicker();

    // Inicializar el modal de Bootstrap
    verificationModal = new bootstrap.Modal(
        document.getElementById("verificationModal")
    );

    // Configuración responsive para la verificación por email
    setupResponsiveVerification();

    // Configurar eventos de validación
    setupValidationEvents();

    // Configurar eventos del formulario
    setupFormEvents();
});

// Configuración del datepicker
function setupDatePicker() {
    const fechaInput = document.getElementById("fecha");

    flatpickr("#fecha", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "j F Y",
        locale: "es",
        disableMobile: false, // Permitir selector nativo en móviles
        onChange: function (selectedDates, dateStr) {
            if (dateStr) {
                fechaInput.classList.add("has-value");
            } else {
                fechaInput.classList.remove("has-value");
            }
        },
    });

    document
        .getElementById("icono-calendario")
        .addEventListener("click", function () {
            if (fechaInput._flatpickr) {
                fechaInput._flatpickr.open();
            }
        });
}

// Configuración responsive para la verificación
function setupResponsiveVerification() {
    const verificationSection = document.querySelector(".verification-section");
    const mobileVerificationContent = document.getElementById(
        "mobile-verification-content"
    );
    const mobileTrigger = document.getElementById("mobile-verification-trigger");

    // Solo para móviles
    if (window.innerWidth <= 992) {
        // Mover contenido al modal solo si no se ha movido antes
        if (
            verificationSection &&
            mobileVerificationContent &&
            mobileVerificationContent.children.length === 0
        ) {
            // Clonar el contenido para no perder los event listeners
            const clonedContent = verificationSection.cloneNode(true);
            mobileVerificationContent.appendChild(clonedContent);

            // Configurar eventos para los elementos clonados
            setupVerificationEvents(mobileVerificationContent);
        }

        // Mostrar botón trigger y configurar su evento
        if (mobileTrigger) {
            mobileTrigger.style.display = "flex";
            mobileTrigger.addEventListener("click", function () {
                verificationModal.show();
            });
        }
    }
}

// Configurar eventos para la verificación (tanto en desktop como en móvil)
function setupVerificationEvents(container = document) {
    // Evento para enviar el código
    container.querySelector("#send-code-btn")?.addEventListener("click", sendVerificationCode);

    // Evento para verificar el código
    container.querySelector("#verify-code-btn")?.addEventListener("click", verifyCode);

    // Evento para reenviar código
    const resendLink = container.querySelector("#resend-code-link");
    if (resendLink) {
        resendLink.addEventListener("click", function (e) {
            e.preventDefault();
            sendVerificationCode();
        });
    }

    // Validación en tiempo real del código
    const codeInput = container.querySelector("#verification-code");
    if (codeInput) {
        codeInput.addEventListener("input", function () {
            const verifyBtn = container.querySelector("#verify-code-btn");
            if (verifyBtn) {
                verifyBtn.disabled = this.value.length !== 6;
            }
        });
    }
}

// Configurar eventos de validación
function setupValidationEvents() {
    // Validación en tiempo real del email
    document.getElementById("email").addEventListener("input", validateEmail);

    // Validación en tiempo real de las contraseñas
    document.getElementById("password").addEventListener("input", function () {
        validatePasswordStrength();
        checkPasswordMatch();
    });

    document
        .getElementById("confirm-password")
        .addEventListener("input", checkPasswordMatch);

    // Eventos para mostrar/ocultar contraseña
    document.querySelectorAll(".toggle-password").forEach((icon) => {
        icon.addEventListener("click", function () {
            const fieldId = this.getAttribute("data-target");
            togglePasswordVisibility(fieldId);
        });
    });
}

// Configurar eventos del formulario
function setupFormEvents() {
    // Evento para enviar el código de verificación
    document.addEventListener("click", function (e) {
        if (e.target.closest("#send-code-btn")) {
            sendVerificationCode();
        }

        if (e.target.closest("#verify-code-btn")) {
            verifyCode();
        }

        if (e.target.closest("#resend-code-link")) {
            e.preventDefault();
            sendVerificationCode();
        }
    });

    // Validación en tiempo real del código de verificación
    document.addEventListener("input", function (e) {
        if (e.target && e.target.id === "verification-code") {
            const code = e.target.value;
            const verifyBtn = document.querySelector("#verify-code-btn");
            if (verifyBtn) {
                verifyBtn.disabled = code.length !== 6;
            }
        }
    });

    // Evento submit del formulario
    document
        .getElementById("registerForm")
        .addEventListener("submit", handleFormSubmit);
}

// Función para validar email
function validateEmail() {
    const email = document.getElementById("email").value;
    const emailValidation = document.getElementById("emailValidation");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailValidation.textContent = "";
        emailValidation.className = "validation-message";
        return false;
    }

    if (!emailRegex.test(email)) {
        emailValidation.style.display = "block";
        emailValidation.textContent =
            "Por favor ingresa un correo electrónico válido";
        emailValidation.className = "validation-message invalid";
        return false;
    } else {
        emailValidation.style.display = "block";
        emailValidation.textContent = "✓ Correo válido";
        emailValidation.className = "validation-message valid";
        return true;
    }
}

// Función para validar fortaleza de contraseña
function validatePasswordStrength() {
    const password = document.getElementById("password").value;
    const strengthBar = document.getElementById("passwordStrengthBar");
    const strengthText = document.getElementById("passwordStrengthText");

    if (!password) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "";
        strengthText.textContent = "";
        return;
    }

    // Calcular fortaleza
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    // Actualizar barra visual y texto
    switch (strength) {
        case 0:
        case 1:
            strengthBar.style.width = "25%";
            strengthBar.style.backgroundColor = "#dc3545";
            strengthText.textContent = "Débil";
            strengthText.style.color = "#dc3545";
            break;
        case 2:
            strengthBar.style.width = "50%";
            strengthBar.style.backgroundColor = "#fd7e14";
            strengthText.textContent = "Moderada";
            strengthText.style.color = "#fd7e14";
            break;
        case 3:
            strengthBar.style.width = "75%";
            strengthBar.style.backgroundColor = "#ffc107";
            strengthText.textContent = "Fuerte";
            strengthText.style.color = "#ffc107";
            break;
        case 4:
            strengthBar.style.width = "100%";
            strengthBar.style.backgroundColor = "#28a745";
            strengthText.textContent = "Muy fuerte";
            strengthText.style.color = "#28a745";
            break;
    }
}

// Función para verificar coincidencia de contraseñas
function checkPasswordMatch() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const matchContainer = document.getElementById("passwordMatch");
    const matchIcon = document.getElementById("passwordMatchIcon");
    const matchText = document.getElementById("passwordMatchText");

    if (!password || !confirmPassword) {
        matchContainer.className = "password-match";
        matchIcon.textContent = "";
        matchText.textContent = "";
        return false;
    }

    if (password === confirmPassword) {
        matchContainer.className = "password-match matched";
        matchIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        matchText.textContent = "Las contraseñas coinciden";
        return true;
    } else {
        matchContainer.className = "password-match unmatched";
        matchIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        matchText.textContent = "Las contraseñas no coinciden";
        return false;
    }
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.parentElement.querySelector(".toggle-password");

    if (field.type === "password") {
        field.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        field.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// Función para enviar código de verificación
function sendVerificationCode() {
    const email = document.getElementById("email").value;
    currentEmail = email;

    // Validar email
    if (!validateEmail(email)) {
        showVerificationStatus(
            "Por favor ingresa un correo electrónico válido",
            "error"
        );
        return;
    }

    // Configurar estado de carga
    const btn = document.querySelector("#send-code-btn");
    const btnText = btn.querySelector(".btn-text");
    const btnIcon = btn.querySelector(".btn-icon");
    btnText.textContent = "Enviando...";
    btnIcon.innerHTML = '<i class="fas fa-spinner loading-spinner"></i>';
    btn.disabled = true;

    showVerificationStatus("Enviando código de verificación...", "warning");

    // Enviar solicitud al servidor
    fetch("/api/send-verification-email?email=" + encodeURIComponent(email), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            return response.text();
        })
        .then((data) => {
            // Mostrar paso de código
            document.getElementById("step-send").style.display = "none";
            document.getElementById("step-code").style.display = "block";

            // Restaurar botón
            btnText.textContent = "Reenviar Código";
            btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            btn.disabled = false;

            // Mostrar éxito
            showVerificationStatus(
                "Código enviado correctamente. Revisa tu correo.",
                "success"
            );

            // Configurar temporizador para reenvío
            setupResendTimer();
        })
        .catch((error) => {
            console.error("Error:", error);
            showVerificationStatus(
                "Error al enviar el código: " + error.message,
                "error"
            );

            // Restaurar botón
            btnText.textContent = "Enviar Código";
            btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            btn.disabled = false;
        });
}

// Función para verificar el código
function verifyCode() {
    const code = document.getElementById("verification-code").value;

    if (!code || code.length !== 6) {
        showVerificationStatus(
            "Por favor ingresa un código válido de 6 dígitos",
            "error"
        );
        return;
    }

    // Configurar estado de carga
    const btn = document.querySelector("#verify-code-btn");
    const btnText = btn.querySelector(".btn-text");
    const btnIcon = btn.querySelector(".btn-icon");
    btnText.textContent = "Verificando...";
    btnIcon.innerHTML = '<i class="fas fa-spinner loading-spinner"></i>';
    btn.disabled = true;

    showVerificationStatus("Verificando código...", "warning");

    // Enviar solicitud al servidor
    fetch(
        "/api/verify-code?email=" +
        encodeURIComponent(currentEmail) +
        "&code=" +
        code,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
        .then((response) => {
            if (!response.ok) throw new Error("Código incorrecto o expirado");
            return response.text();
        })
        .then((data) => {
            // Marcar como verificado
            isEmailVerified = true;
            document.getElementById("email").classList.add("verified");

            // Mostrar éxito
            showVerificationStatus("Correo verificado correctamente!", "success");

            // Deshabilitar controles
            document.getElementById("verification-code").disabled = true;
            btn.disabled = true;
            btnText.textContent = "Verificado";
            btnIcon.innerHTML = '<i class="fas fa-check"></i>';

            // Limpiar temporizador
            if (verificationTimer) {
                clearInterval(verificationTimer);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            showVerificationStatus(error.message, "error");

            // Restaurar botón
            btnText.textContent = "Verificar";
            btnIcon.innerHTML = '<i class="fas fa-check"></i>';
            btn.disabled = false;
        });
}

// Función para mostrar estado de verificación
function showVerificationStatus(message, type) {
    const statusElement = document.getElementById("verification-status");
    if (!statusElement) return;

    const statusIcon = statusElement.querySelector(".status-icon");
    const statusMessage = statusElement.querySelector(".status-message");

    // Configurar clase y contenido
    statusElement.className = "verification-status " + type;
    statusMessage.textContent = message;
    statusIcon.className =
        "status-icon fas " +
        (type === "success"
            ? "fa-check-circle"
            : type === "error"
                ? "fa-exclamation-circle"
                : "fa-info-circle");
    statusElement.style.display = "block";
}

// Función para configurar temporizador de reenvío
function setupResendTimer() {
    let seconds = 60;
    const resendLink = document.getElementById("resend-code-link");
    if (!resendLink) return;

    // Inicialmente deshabilitado
    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";
    resendLink.textContent = `Reenviar código (${seconds}s)`;

    // Configurar temporizador
    verificationTimer = setInterval(() => {
        seconds--;
        resendLink.textContent = `Reenviar código (${seconds}s)`;

        if (seconds <= 0) {
            clearInterval(verificationTimer);
            resendLink.textContent = "Reenviar código";
            resendLink.style.pointerEvents = "auto";
            resendLink.style.opacity = "1";
        }
    }, 1000);
}

// Manejador del envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    // Validar si el correo fue verificado (solo en móviles)
    if (window.innerWidth <= 992 && !isEmailVerified) {
        Swal.fire({
            icon: "error",
            title: "Correo no verificado",
            text: "Por favor, verifica tu correo antes de continuar.",
        });

        // Abrir modal automáticamente en móviles
        const modal = new bootstrap.Modal(
            document.getElementById("verificationModal")
        );
        modal.show();
        return;
    }

    // Validar email
    if (!validateEmail()) {
        Swal.fire({
            icon: "error",
            title: "Correo inválido",
            text: "Por favor ingresa un correo electrónico válido.",
        });
        return;
    }

    // Validar contraseñas
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Las contraseñas no coinciden. Por favor, verifica.",
        });
        return;
    }

    // Validar fortaleza de contraseña
    if (password.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Contraseña débil",
            text: "La contraseña debe tener al menos 8 caracteres.",
        });
        return;
    }

    // Validar edad
    const fechaInput = document.getElementById("fecha").value;
    const fechaNacimiento = new Date(fechaInput);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();
    const edadReal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

    if (edadReal < 18) {
        Swal.fire({
            icon: "error",
            title: "Edad inválida",
            text: "Debes tener al menos 18 años para registrarte.",
            confirmButtonText: "Entendido",
        });
        return;
    }

    // Si todo está bien, mostrar confirmación
    Swal.fire({
        icon: "success",
        title: "¡Te registraste con éxito!",
        confirmButtonText: "Aceptar",
    }).then(function (result) {
        if (result.isConfirmed) {
            document.getElementById("registerForm").submit();
        }
    });
}

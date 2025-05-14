// script para el calendario
const fechaInput = document.getElementById("fecha");

flatpickr("#fecha", {
    dateFormat: "Y-m-d",  // Formato personalizado
    altInput: true,
    altFormat: "F j, Y",  // Formato visible más amigable
    locale: "es",         // Idioma en español
    allowInput: false,  // Permitir escribir manualmente
    disableMobile: true, // Usa el selector nativo en móviles
    onChange: function (selectedDates, dateStr) {
        if (dateStr) {
            fechaInput.classList.add("has-value");  // Agregar clase si hay fecha
        } else {
            fechaInput.classList.remove("has-value");  // Quitar clase si está vacío
        }
    }
});

document.getElementById("icono-calendario").addEventListener("click", function () {
    fechaInput._flatpickr.open(); // Abre el calendario
});


// Validación en tiempo real del email
document.getElementById('email').addEventListener('input', function () {
    validateEmail();
});

// Validación en tiempo real de las contraseñas
document.getElementById('password').addEventListener('input', function () {
    validatePasswordStrength();
    checkPasswordMatch();
});

document.getElementById('confirm-password').addEventListener('input', function () {
    checkPasswordMatch();
});

// Función para validar email
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailValidation = document.getElementById('emailValidation');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        emailValidation.textContent = '';
        emailValidation.className = 'validation-message';
        return false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById('emailValidation').style.display = 'block';
        emailValidation.textContent = 'Por favor ingresa un correo electrónico válido';
        emailValidation.className = 'validation-message invalid';
        return false;
    } else {
        document.getElementById('emailValidation').style.display = 'block';
        emailValidation.textContent = '✓ Correo válido';
        emailValidation.className = 'validation-message valid';
        return true;
    }
}

// Función para validar fortaleza de contraseña
function validatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');

    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '';
        strengthText.textContent = '';
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
            strengthBar.style.width = '25%';
            strengthBar.style.backgroundColor = '#dc3545';
            strengthText.textContent = 'Débil';
            strengthText.style.color = '#dc3545';
            break;
        case 2:
            strengthBar.style.width = '50%';
            strengthBar.style.backgroundColor = '#fd7e14';
            strengthText.textContent = 'Moderada';
            strengthText.style.color = '#fd7e14';
            break;
        case 3:
            strengthBar.style.width = '75%';
            strengthBar.style.backgroundColor = '#ffc107';
            strengthText.textContent = 'Fuerte';
            strengthText.style.color = '#ffc107';
            break;
        case 4:
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#28a745';
            strengthText.textContent = 'Muy fuerte';
            strengthText.style.color = '#28a745';
            break;
    }
}

// Función para verificar coincidencia de contraseñas
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const matchContainer = document.getElementById('passwordMatch');
    const matchIcon = document.getElementById('passwordMatchIcon');
    const matchText = document.getElementById('passwordMatchText');

    if (!password || !confirmPassword) {
        matchContainer.className = 'password-match';
        matchIcon.textContent = '';
        matchText.textContent = '';
        return false;
    }

    if (password === confirmPassword) {
        matchContainer.className = 'password-match matched';
        matchIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        matchText.textContent = 'Las contraseñas coinciden';
        return true;
    } else {
        matchContainer.className = 'password-match unmatched';
        matchIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        matchText.textContent = 'Las contraseñas no coinciden';
        return false;
    }
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.parentElement.querySelector('.toggle-password');

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Modifica el evento submit para incluir validaciones
document.getElementById('registerForm').addEventListener('submit', function (event) {
    // Validar email
    if (!validateEmail()) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Correo inválido',
            text: 'Por favor ingresa un correo electrónico válido.'
        });
        return;
    }

    // Validar contraseñas
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Las contraseñas no coinciden. Por favor, verifica.'
        });
        return;
    }

    // Validar fortaleza de contraseña
    if (password.length < 8) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Contraseña débil',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }

    // Validar edad (tu código existente)
    const fechaInput = document.getElementById('fecha').value;
    const fechaNacimiento = new Date(fechaInput);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();
    const edadReal = (mes < 0 || (mes === 0 && dia < 0)) ? edad - 1 : edad;

    if (edadReal < 18) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Edad inválida',
            text: 'Debes tener al menos 18 años para registrarte.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Si todo está bien, mostrar confirmación
    event.preventDefault();
    Swal.fire({
        icon: 'success',
        title: '¡Te registraste con éxito!',
        confirmButtonText: 'Aceptar'
    }).then(function (result) {
        if (result.isConfirmed) {
            this.submit();
        }
    }.bind(this));
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita envío inicial

    // Validar si el correo fue verificado
    if (!isEmailVerified) {
        Swal.fire({
            icon: 'error',
            title: 'Correo no verificado',
            text: 'Por favor, verifica tu correo antes de continuar.'
        });
        return;
    }

    // Validar email
    if (!validateEmail()) {
        Swal.fire({
            icon: 'error',
            title: 'Correo inválido',
            text: 'Por favor ingresa un correo electrónico válido.'
        });
        return;
    }

    // Validar contraseñas
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Las contraseñas no coinciden. Por favor, verifica.'
        });
        return;
    }

    // Validar fortaleza de contraseña
    if (password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña débil',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }

    // Validar edad
    const fechaInput = document.getElementById('fecha').value;
    const fechaNacimiento = new Date(fechaInput);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();
    const edadReal = (mes < 0 || (mes === 0 && dia < 0)) ? edad - 1 : edad;

    if (edadReal < 18) {
        Swal.fire({
            icon: 'error',
            title: 'Edad inválida',
            text: 'Debes tener al menos 18 años para registrarte.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Si todo está bien, mostrar confirmación
    Swal.fire({
        icon: 'success',
        title: '¡Te registraste con éxito!',
        confirmButtonText: 'Aceptar'
    }).then(function (result) {
        if (result.isConfirmed) {
            document.getElementById('registerForm').submit(); // Ahora sí envía el formulario
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
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

    // Validar NIT (ejemplo básico)
    const nit = document.getElementById('nit').value;
    if (!nit || nit.length < 7 || nit.length > 9 || !/^\d+$/.test(nit)) {
        event.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'NIT inválido',
            text: 'Por favor ingresa un NIT válido (7-9 dígitos).'
        });
        return;
    }

    // Si todo está bien, mostrar confirmación
    event.preventDefault();
    Swal.fire({
        icon: 'success',
        title: '¡Empresa registrada con éxito!',
        text: 'Tu cuenta de empresa ha sido creada correctamente.',
        confirmButtonText: 'Aceptar'
    }).then(function (result) {
        if (result.isConfirmed) {
            this.submit();
        }
    }.bind(this));
});

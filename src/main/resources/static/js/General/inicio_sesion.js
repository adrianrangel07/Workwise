//Mostrar - ocultar la contraseña
document.getElementById('show-password').addEventListener('click', function () {
    var passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.textContent = 'hide';
    } else {
        passwordField.type = 'password';
        this.textContent = 'show';
    }
});

// Mensajes de error según el tipo
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const cuentaDesactivada = urlParams.get("desactivada");

    if (cuentaDesactivada) {
        Swal.fire({
            icon: 'error',
            title: 'Cuenta deshabilitada',
            html: 'Tu cuenta ha sido deshabilitada. <br>Por favor, ponte en contacto con nuestro soporte.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        });
    } else if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Credenciales incorrectas. Inténtalo de nuevo.',
        });
    }

    const adminLogout = urlParams.get("adminLogout");
    if (adminLogout) {
        Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión como administrador.',
        });
    }
});

function validarFormulario() {
    var email = document.getElementById('InputEmail').value.trim();
    var password = document.getElementById('password').value.trim();

    if (email === "" || password === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, ingresa tu correo y contraseña.',
        });
        return false;
    }

    // Opcional: Validación especial para admin (puedes personalizar)
    if (email.endsWith('@wkn.com') && password === 'admin123') {
        // Esto es solo para dar un mensaje, el control real está en el backend
        Swal.fire({
            icon: 'info',
            title: 'Acceso administrativo',
            text: 'Estás ingresando como administrador',
        });
    }

    return true;
}


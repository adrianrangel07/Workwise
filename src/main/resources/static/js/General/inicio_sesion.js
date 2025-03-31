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

// mensaje de error cuando la contraseña es incorrecta
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Credenciales incorrectas. Inténtalo de nuevo.',
        });
    }
});

function validarFormulario() {
    var email = document.getElementById('InputEmail').value;
    var password = document.getElementById('password').value;
    if (email.trim() === "" || password.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, ingresa tu correo y contraseña.',
        });
        return false; // Evita el envío del formulario
    }
    return true;
}


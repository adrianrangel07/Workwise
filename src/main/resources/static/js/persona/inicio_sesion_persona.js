//Mostrar - ocultar la contraseña
document.getElementById('show-password').addEventListener('click', function() {
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


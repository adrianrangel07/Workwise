document.addEventListener("DOMContentLoaded", function() {
    generarCaptcha(); // Generar captcha al cargar
});

function generarCaptcha() {
    let captcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("captchaText").innerText = captcha;
}

// Validar el captcha y verificar si el correo está registrado
function validarCaptcha() {
    let captchaIngresado = document.getElementById("captchaInput").value;
    let captchaCorrecto = document.getElementById("captchaText").innerText;
    let email = document.getElementById("email").value;

    if (captchaIngresado !== captchaCorrecto) {
        Swal.fire("Error", "Captcha incorrecto, inténtelo de nuevo.", "error");
        generarCaptcha();
        return;
    }

    fetch("/verificar-correo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "NO_REGISTRADO") {
            Swal.fire({
                title: "Correo no registrado",
                text: "Te redirigiremos al registro.",
                icon: "warning",
                confirmButtonText: "Ir al registro"
            }).then(() => {
                window.location.href = "/Register/personas";
            });
        } else {
            Swal.fire("Verificado", "Correo encontrado. Ahora puede cambiar su contraseña.", "success");
            document.getElementById("resetForm").style.display = "block";
        }
    })
    .catch(() => Swal.fire("Error", "Hubo un problema verificando el correo.", "error"));
}

function cambiarContrasena() {
    let nuevaContraseña = document.getElementById("nuevaContraseña").value;
    let repetirContraseña = document.getElementById("repetirContraseña").value;
    let email = document.getElementById("email").value;

    // Validar si los campos están vacíos
    if (nuevaContraseña === "" || repetirContraseña === "") {
        Swal.fire("Error", "Los campos de contraseña no pueden estar vacíos.", "error");
        return;
    }

    // Validar si las contraseñas coinciden
    if (nuevaContraseña !== repetirContraseña) {
        Swal.fire("Error", "Las contraseñas no coinciden.", "error");
        return;
    }

    //enviar la contraseña para cambiar
    fetch("/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nuevaContraseña })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "OK") {
            Swal.fire({
                title: "Éxito",
                text: "Contraseña cambiada correctamente.",
                icon: "success",
                confirmButtonText: "Iniciar sesión"
            }).then(() => {
                window.location.href = "/login/personas";
            });
        } else {
            Swal.fire("Error", "Hubo un problema al cambiar la contraseña.", "error");
        }
    })
    .catch(() => Swal.fire("Error", "Hubo un error en la solicitud.", "error"));
}

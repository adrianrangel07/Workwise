document.addEventListener("DOMContentLoaded", function () {
    var loginMeta = document.getElementById("loginSuccess");
    var loginSuccess = loginMeta ? loginMeta.content === "true" : false;

    console.log("loginSuccess:", loginSuccess); // Para ver si se detecta correctamente

    if (loginSuccess) {
        Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Bienvenido a la plataforma.",
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            fetch("/eliminarLoginSuccess", { method: "POST" });
        });
    }
});
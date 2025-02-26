//codigo que hace que aparezca la foto de perfil 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del usuario desde el HTML
    const usuarioNombre = document.getElementById("usuario");
    const userAvatar = document.getElementById("user-avatar");

    // Si hay una foto en localStorage, usarla
    if (localStorage.getItem("fotoPerfil")) {
        userAvatar.src = localStorage.getItem("fotoPerfil");
    }

    // Evento para actualizar la foto cuando el usuario la cambia
    function actualizarFotoPerfil(nuevaFoto) {
        userAvatar.src = nuevaFoto;
        localStorage.setItem("fotoPerfil", nuevaFoto); // Guardar en localStorage
    }

    // Simulación: si el usuario sube una nueva imagen
    document.getElementById("subirFoto").addEventListener("change", function (event) {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                actualizarFotoPerfil(e.target.result);
            };
            lector.readAsDataURL(archivo);
        }
    });
});


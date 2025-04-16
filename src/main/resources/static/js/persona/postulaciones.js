document.addEventListener("DOMContentLoaded", function () {
    let estadosElementos = document.querySelectorAll(".estado"); // Selecciona TODOS los estados

    estadosElementos.forEach(estadoElemento => {
        let estadoTexto = estadoElemento.querySelector("span").innerText.trim().toLowerCase();
        console.log("Estado encontrado:", estadoTexto);

        // Asignar clase según el estado
        switch (estadoTexto) {
            case "pendiente":
                estadoElemento.style.color = "black";
                estadoElemento.style.backgroundColor = "yellow";
                break;
            case "aceptado":
                estadoElemento.style.color = "white";
                estadoElemento.style.backgroundColor = "green";
                break;
            case "rechazado":
                estadoElemento.style.color = "white";
                estadoElemento.style.backgroundColor = "red";
                break;
            default:
                estadoElemento.style.color = "black";
                estadoElemento.style.backgroundColor = "lightgray"; // Color por defecto
                break;
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar todas las tarjetas de postulaciones
    const applicationCards = document.querySelectorAll('.offer-container .card');
    const resolvedContainer = document.getElementById('resolved-applications-container');
    const noResolvedMessage = document.querySelector('.no-resolved');

    // Contador para aplicaciones resueltas
    let resolvedCount = 0;

    applicationCards.forEach(card => {
        const estadoElemento = card.querySelector('.estado');
        const estadoTexto = estadoElemento.querySelector('span').innerText.trim().toLowerCase();
        const estadoId = estadoElemento.getAttribute('data-id');


        // Añadir clase según el estado
        card.classList.add(estadoTexto === 'pendiente' ? 'pending' :
            estadoTexto === 'aceptado' ? 'accepted' : 'rejected');


        // Mover aplicaciones resueltas a la sección correspondiente
        if (estadoTexto === 'aceptado' || estadoTexto === 'rechazado') {
            card.classList.add('resolved-card');
            resolvedContainer.insertBefore(card, noResolvedMessage);
            resolvedCount++;

            // Cambiar el botón de eliminar por uno de feedback
            const deleteBtn = card.querySelector('.btn-danger');
            if (deleteBtn) {
                deleteBtn.textContent = estadoTexto === 'aceptado' ? 'Fuiste seleccionado!' : 'No fuiste seleccionado :(';
                deleteBtn.className = estadoTexto === 'aceptado' ?
                    'btn btn-success' : 'btn btn-warning';
                deleteBtn.onclick = null;
                deleteBtn.style.cursor = 'default';
                deleteBtn.title = estadoTexto === 'aceptado'
                    ? '¡Felicitaciones! Se estaran comunicando contigo'
                    : 'No fuiste seleccionado esta vez. ¡No te rindas!';

            }
        }
    });

    // Ocultar mensaje de "no hay aplicaciones" si hay resueltas
    if (resolvedCount > 0) {
        noResolvedMessage.style.display = 'none';
    }

});

function eliminarPostulacion(button) {
    var postulacionId = button.getAttribute('data-id');

    // Mostrar confirmación antes de eliminar
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, se envía la solicitud de eliminación
            fetch(`/postulacion/eliminar/${postulacionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Eliminar la postulación del DOM
                        button.closest('.card').remove();
                        Swal.fire({
                            icon: 'success',
                            title: '¡Eliminado!',
                            text: 'Tu postulación ha sido eliminada exitosamente.',
                            showConfirmButton: true,
                            confirmButtonText: 'Ok'
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al eliminar la postulación.',
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al realizar la solicitud.',
                    });
                });
        }
    });
}

function cerrarSesionYRedirigir(event) {
    event.preventDefault(); // Evita la navegación inmediata

    Swal.fire({
        title: "Cerrando sesión...",
        text: "Estamos cerrando tu sesión. Por favor, espera.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading(); // Muestra un loader

            // Enviar la solicitud de cierre de sesión
            fetch('/logout', { method: 'POST' })
                .then(response => {
                    // Esperamos 2 segundos antes de redirigir, asegurando que la sesión se cierre
                    setTimeout(() => {
                        window.location.href = '/login/Empresa';
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error al cerrar sesión:', error);
                    Swal.fire("Error", "No se pudo cerrar la sesión.", "error");
                });
        }
    });
}

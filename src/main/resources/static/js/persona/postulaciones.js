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

// Función para manejar el clic en el botón de eliminar
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

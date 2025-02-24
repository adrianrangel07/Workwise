//no quitar 
document.addEventListener('DOMContentLoaded', function () {
    // Mostrar el formulario al hacer clic en "Change Photo"
    document.getElementById('changePhotoBtn').addEventListener('click', function () {
        document.getElementById('uploadForm').style.display = 'block'; // Muestra el formulario
        document.getElementById('cancelUploadBtn').style.display = 'inline-block'; // Muestra el botón de cancelar
    });

    // Ocultar el formulario al hacer clic en "Cancel"
    document.getElementById('cancelUploadBtn').addEventListener('click', function () {
        document.getElementById('uploadForm').style.display = 'none'; // Oculta el formulario
        document.getElementById('cancelUploadBtn').style.display = 'none'; // Oculta el botón de cancelar
    });

    // Mostrar la nueva imagen al cambiar la foto
    document.querySelector('input[name="file"]').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('profileImage').src = e.target.result; // Muestra la nueva imagen
        };

        reader.readAsDataURL(file);
    });

    // Interceptar el submit del formulario
    document.getElementById('uploadForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío del formulario para mostrar SweetAlert primero

        // Mostrar SweetAlert con el mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Foto cambiada',
            text: 'Tu foto de perfil ha sido actualizada exitosamente!',
            showConfirmButton: true,
            confirmButtonText: 'Ok'
        }).then((result) => {
            // Después de que el usuario haga clic en "Ok", se puede enviar el formulario
            if (result.isConfirmed) {
                this.submit(); // Enviar el formulario después de mostrar el mensaje
            }
        });
    });
});

// boton cambio de datos
const saveButton = document.getElementById('save_btn');
document.getElementById('change_btn').addEventListener('click', function () {
    // Selecciona todos los inputs del formulario
    document.querySelectorAll('input').forEach(input => {
        // Verifica si el input no es el de fecha
        if (input.id !== 'birthdate') {
            input.disabled = false; 
            saveButton.disabled = false;
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

// borrar HDV
function eliminarHojaDeVida() {
    fetch('/eliminarHDV', {
        method: 'POST'
    })
    .then(response => response.text())
    .then(data => {
        Swal.fire({
            icon: data.includes("Error") ? 'error' : 'success',
            title: 'Hoja de Vida',
            text: data,
            showConfirmButton: true,
            confirmButtonText: 'Ok'
        });
        if (!data.includes("Error")) {
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la hoja de vida.',
            showConfirmButton: true,
            confirmButtonText: 'Ok'
        });
    });
}

// fin borrar HDV

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("uploadFormcv");
    const fileInput = document.getElementById("fileInput");
    const messageDiv = document.getElementById("message");
    const pdfViewer = document.getElementById("pdfViewer");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
    
        const file = fileInput.files[0];
    
        if (!file) {
            messageDiv.innerHTML = "<p style='color: red;'>Por favor, seleccione un archivo.</p>";
            return;
        }
    
        if (file.type !== "application/pdf") {
            messageDiv.innerHTML = "<p style='color: red;'>Solo se permiten archivos PDF.</p>";
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        fetch("/uploadHDV", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            messageDiv.innerHTML = `<p style='color: ${data.includes("Error") ? "red" : "green"};'>${data}</p>`;
            if (!data.includes("Error")) {
                setTimeout(() => {
                    pdfViewer.src = "/perfil/verHDV"; // Recargar el visor del PDF
                }, 2000);
            }
        })
        .catch(error => {
            messageDiv.innerHTML = "<p style='color: red;'>Error: " + error.message + "</p>";
        });
    });
    
});
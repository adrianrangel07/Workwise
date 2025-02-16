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
                title: 'postulacion',
                text: 'Tu postulacion a sido borrada nexitosamente!',
                showConfirmButton: true,
                confirmButtonText: 'Ok'
            })
        } else {
            alert('Hubo un problema al eliminar la postulación');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al realizar la solicitud');
    });
}

// borrar HDV
function eliminarHojaDeVida() {
    fetch('/eliminarHDV', {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Hoja de Vida',
                text: '¡Tu hoja de vida ha sido borrada exitosamente!',
                showConfirmButton: true,
                confirmButtonText: 'Ok'
            });
            // Esperar 2 segundos antes de recargar
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage);
            });
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


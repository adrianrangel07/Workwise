document.addEventListener('DOMContentLoaded', function () {
    // Mostrar el formulario al hacer clic en "Change Photo"
    document.getElementById('changePhotoBtn').addEventListener('click', function () {
        document.getElementById('uploadForm').style.display = 'block';
        document.getElementById('cancelUploadBtn').style.display = 'inline-block';
    });

    // Ocultar el formulario al hacer clic en "Cancel"
    document.getElementById('cancelUploadBtn').addEventListener('click', function () {
        document.getElementById('uploadForm').style.display = 'none';
        document.getElementById('cancelUploadBtn').style.display = 'none';
    });

    // Mostrar la nueva imagen al cambiar la foto
    document.querySelector('input[name="file"]').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('empresa-avatar').src = e.target.result; // Muestra la nueva imagen
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
            text: 'La foto de la empresa ha sido actualizada exitosamente!',
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

//verificar contraseña para cambiar los datos de la empresa
document.addEventListener('DOMContentLoaded', function () {
    const changeButton = document.getElementById('change_btn');
    const saveButton = document.getElementById('save_btn');
    const form = document.getElementById('updateForm');

    changeButton.addEventListener('click', function () {
        Swal.fire({
            title: 'Verificación requerida',
            text: 'Ingresa tu contraseña para hacer cambios:',
            input: 'password',
            inputPlaceholder: 'Contraseña',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                verificarContraseña(result.value);
            } else {
                location.reload(); // Si cancela, recarga la página
            }
        });
    });

    function verificarContraseña(password) {
        fetch('/verificar-contrasena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valido) {
                habilitarEdicion(); // Si la contraseña es correcta, habilita los campos
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Contraseña incorrecta',
                    text: 'Inténtalo nuevamente.'
                }).then(() => location.reload()); // Recarga la página si es incorrecta
            }
        })
        .catch(error => console.error('Error en la verificación:', error));
    }

    function habilitarEdicion() {
        document.querySelectorAll('input:not([type="email"]):not([type="password"])').forEach(input => {
            input.disabled = false; // Habilita todos menos email y password
        });
        saveButton.disabled = false; // Habilita "Save changes"
    }
});


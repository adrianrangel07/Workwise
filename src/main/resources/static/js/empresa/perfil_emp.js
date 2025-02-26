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




const saveButton = document.getElementById('save_btn');
document.getElementById('change_btn').addEventListener('click', function () {
    document.querySelectorAll('input:not([type="email"]):not([type="password"])').forEach(input => {
        input.disabled = false; // Habilita todos menos email y password
    });
    saveButton.disabled = false;
});

document.getElementById('updateForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir el envío

    Swal.fire({
        title: 'Confirmar cambios',
        text: 'Ingresa tu contraseña para confirmar:',
        input: 'password',
        inputPlaceholder: 'Contraseña',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            document.getElementById('confirmPassword').value = result.value; // Asigna la contraseña ingresada
            this.submit(); // Envía el formulario
        }
    });
});

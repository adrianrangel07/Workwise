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
        event.preventDefault(); // Evita que el formulario se envíe automáticamente
    
        const formData = new FormData(this);
    
        fetch('/upload/photo', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Foto cambiada',
                    text: 'Tu foto de perfil ha sido actualizada exitosamente!',
                    showConfirmButton: true,
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Recargar la imagen desde el backend después de la subida
                    document.getElementById('user-avatar').src = "/imagen/perfil?" + new Date().getTime(); // Evita caché
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al subir la imagen.',
                });
            }
        }).catch(error => console.error('Error:', error));
    }); 
});


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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadFormcv");
    const fileInput = document.getElementById("fileInput");
    const messageDiv = document.getElementById("message");
    const pdfViewer = document.getElementById("pdfViewer");

    form.addEventListener("submit", function (event) {
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
        fetch('/verificar-contrasena/persona', {
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

function eliminarCuenta() {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará tu cuenta permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Segunda confirmación
            Swal.fire({
                title: "Última confirmación",
                text: "¿Realmente deseas eliminar tu cuenta? Esta acción es irreversible.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar definitivamente"
            }).then((finalResult) => {
                if (finalResult.isConfirmed) {
                    fetch('/eliminar-cuenta', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title: "Cuenta eliminada",
                                text: "Tu cuenta ha sido eliminada correctamente.",
                                icon: "success",
                                timer: 3000,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = "/login/personas"; // Redirigir al login
                            });
                        } else {
                            return response.text().then(text => { throw new Error(text); });
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            title: "Error",
                            text: "Error al eliminar la cuenta: " + error.message,
                            icon: "error"
                        });
                    });
                }
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



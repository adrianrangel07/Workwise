
document.getElementById('btn-register').addEventListener('click', function (event) {
    // Obtener los valores de los campos de contraseña y confirmar contraseña
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        // Si no coinciden, mostrar un mensaje de alerta y evitar el envío del formulario
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Las contraseñas no coinciden. Por favor, verifica.'
        }).then(() => {
            location.reload();
        });
        event.preventDefault(); // Evita que el formulario se envíe
    }
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previene el envío automático del formulario

    Swal.fire({
        icon: 'success',
        title: '¡Te registraste con éxito!',
        confirmButtonText: 'Aceptar'
    }).then(function (result) {
        if (result.isConfirmed) {
            document.getElementById('registerForm').submit(); // Envía el formulario después de la confirmación del SweetAlert
        }
    });
});

document.getElementById("registerForm").addEventListener("submit", function(event) {
    const fechaInput = document.getElementById("fecha").value;
    const fechaNacimiento = new Date(fechaInput);
    const hoy = new Date();

    // Calculamos la edad
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();
    const edadReal = (mes < 0 || (mes === 0 && dia < 0)) ? edad - 1 : edad;

    if (edadReal < 18) {
        event.preventDefault(); // Cancela el envío del formulario

        // SweetAlert para mostrar el mensaje
        Swal.fire({
            icon: 'error',
            title: 'Edad inválida',
            text: 'Debes tener al menos 18 años para registrarte.',
            confirmButtonText: 'Entendido'
        }).then(() => {
            // Opcional: Recargar la página para limpiar el formulario
            window.location.reload();
        });
    }
});





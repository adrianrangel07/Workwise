
const saveButton = document.getElementById('save_btn');
document.getElementById('change_btn').addEventListener('click', function () {
    // Selecciona todos los inputs del formulario
    document.querySelectorAll('input').forEach(input => {
        input.disabled = false; // Habilita el campo
        saveButton.disabled = false;
    });
});




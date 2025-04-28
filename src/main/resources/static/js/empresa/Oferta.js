document.getElementById('jobOfferForm').addEventListener('submit', function (event) {
    event.preventDefault();

    Swal.fire({
        icon: 'success',
        title: 'Oferta Publicada',
        text: '¡Tu oferta ha sido publicada exitosamente!',
    }).then(() => {
        this.submit();
    });
});

function cancelarOferta() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se perderán los cambios no guardados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/empresas/pagina_principal";
        }
    });
}

// pasar pagina
// Variables globales
let currentStep = 0;
const totalSteps = document.querySelectorAll('.step').length;
const formSteps = document.querySelector('.form-steps');

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    initEditor();
    showCurrentStep();
});

// Configuración del editor
function initEditor() {
    const editor = document.getElementById('editorContent');
    const textarea = document.getElementById('jobDescription');

    // Copiar contenido en tiempo real
    editor.addEventListener('input', function () {
        textarea.value = this.innerHTML;

        // Remover la clase de error si se empieza a escribir
        if (this.textContent.trim() !== '' && !this.textContent.includes('Consejos: Haz un resumen')) {
            this.classList.remove('error');
            const errorMsg = this.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });

    // Manejar cuando el editor pierde el foco
    editor.addEventListener('blur', function () {
        if (this.textContent.trim() === '' || this.textContent.includes('Consejos: Haz un resumen')) {
            this.classList.add('error');
            showEditorError(this);
        }
    });
}

// Mostrar error en el editor
function showEditorError(editorElement) {
    let errorMsg = editorElement.nextElementSibling;

    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        Swal.fire({
            title: 'Completo los campos requeridos',
            text: "Se perderán los cambios no guardados.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
        })
    }
}

// Validación del paso actual
function validateStep(step) {
    const currentStepElement = document.querySelectorAll('.step')[step];
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    // Resetear errores
    currentStepElement.querySelectorAll('.error-message').forEach(el => el.remove());
    currentStepElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    requiredFields.forEach(field => {
        let isFieldValid = true;

        // Validación especial para selects
        if (field.tagName === 'SELECT') {
            const selectedOption = field.options[field.selectedIndex];
            if (selectedOption.disabled || !field.value) {
                isFieldValid = false;
                Swal.fire({
                    title: 'Completo los campos requeridos',
                    text: "Se perderán los cambios no guardados.",
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                })
            }
        }
        // Validación para inputs normales
        else if (!field.value.trim()) {
            isFieldValid = false;
            Swal.fire({
                title: 'Completo los campos requeridos',
                text: "Se perderán los cambios no guardados.",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#3085d6',
            })
        }

        // Mostrar error si el campo no es válido
        if (!isFieldValid) {
            field.classList.add('error');
            isValid = false;
            Swal.fire({
                title: 'Completo los campos requeridos',
                text: "Se perderán los cambios no guardados.",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#3085d6',
            })
        }
    });

    // Validación especial para el editor en el paso 2
    if (step === 1) {
        const editor = document.getElementById('editorContent');
        const textarea = document.getElementById('jobDescription');

        // Actualizar el textarea por si acaso
        textarea.value = editor.innerHTML;

        // Validar contenido
        if (editor.textContent.trim() === '' || editor.textContent.includes('Consejos: Haz un resumen')) {
            editor.classList.add('error');
            showEditorError(editor);
            isValid = false;
            Swal.fire({
                title: 'Completo los campos requeridos',
                text: "Se perderán los cambios no guardados.",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#3085d6',
            })
        }
    }

    // Validar campos requeridos normales
    currentStepElement.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            Swal.fire({
                title: 'Completo los campos requeridos',
                text: "Se perderán los cambios no guardados.",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#3085d6',
            })
        }
    });

    return isValid;
}

// Navegación entre pasos
function nextStep() {
    if (!validateStep(currentStep)) {
        return false;
    }

    if (currentStep < totalSteps - 1) {
        document.querySelectorAll('.step')[currentStep].style.display = 'none';
        currentStep++;
        document.querySelectorAll('.step')[currentStep].style.display = 'block';
        updateStepIndicator();
    }
    return true;
}

function prevStep() {
    if (currentStep > 0) {
        document.querySelectorAll('.step')[currentStep].style.display = 'none';
        currentStep--;
        document.querySelectorAll('.step')[currentStep].style.display = 'block';
        updateStepIndicator();
    }
}

// Mostrar paso actual
function showCurrentStep() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.style.display = index === currentStep ? 'block' : 'none';
    });
    updateStepIndicator();
}

// Actualizar indicador de pasos
function updateStepIndicator() {
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentStep);
    });

    document.querySelectorAll('.step-text').forEach((text, index) => {
        text.style.fontWeight = index === currentStep ? 'bold' : 'normal';
    });
}

function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}


function forzarActualizarCampos() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.blur();
    });
}

// Puedes llamar esta función cuando el usuario haga clic en "Vista previa" o "Siguiente"
function llenarVistaPrevia() {

    forzarActualizarCampos();

    const obtenerExperiencia = document.querySelector('select[name="experiencia"]');
    function obtenerValorExperiencia() {
        if (obtenerExperiencia.value === "0") {
            return "Sin experiencia";
        }
        else if (obtenerExperiencia.value === "1") {
            return "Menos de 1 año";
        }
        else if (obtenerExperiencia.value === "2") {
            return "Entre 1 y 3 años";
        }
        else if (obtenerExperiencia.value === "3") {
            return "Entre 3 y 5 años";
        }
        else if (obtenerExperiencia.value === "4") {
            return "Entre 5 y 10 años";
        }
        else if (obtenerExperiencia.value === "5") {
            return "Más de 10 años";
        }
        else {
            return "No especificado";
        }
    }

    // Obtener valores del formulario
    const titulo = document.querySelector('input[name="titulo_puesto"]').value;
    const moneda = document.querySelector('select[name="moneda"]').value;
    const periodo = document.querySelector('select[name="periodo"]').value;
    const modalidad = document.querySelector('select[name="modalidad"]').value;
    const tipoContrato = document.querySelector('select[name="tipo_contrato"]').value;
    const duracion = document.querySelector('select[name="duracion"]').value;
    const tipoEmpleo = document.querySelector('select[name="tipo_empleo"]').value;
    const experiencia = obtenerValorExperiencia();
    const sector = document.querySelector('select[name="sector_oferta"]').value;
    const salario = document.querySelector('input[name="salario"]').value;
    const nivelEstudio = document.querySelector('select[name="nivel-estudio"]').value;

    // Descripción con formato (desde contenteditable)
    const editor = document.getElementById('editorContent');
    const descripcionHTML = editor.innerHTML;

    // Insertar los valores en la vista previa (modal)
    document.getElementById("modal-title").innerText = titulo || "Título del puesto";
    document.getElementById("modal-currency").innerText = `(${moneda || ""})`;
    document.getElementById("modal-period").innerText = `(${periodo || ""})`;
    document.getElementById("modal-type").innerText = tipoEmpleo || "";
    document.getElementById("modal-modalidad").innerText = modalidad || "";
    document.getElementById("modal-typeContract").innerText = tipoContrato || "";
    document.getElementById("modal-duration").innerText = `(${duracion || ""})`;
    document.getElementById("modal-experience").innerText = experiencia || "";
    document.getElementById("modal-sector").innerText = sector || "";
    document.getElementById("modal-salary").innerText = salario || "";
    document.getElementById("modal-studyLevel").innerText = nivelEstudio || "";
    document.getElementById("modal-description").innerHTML = descripcionHTML || "<p>Descripción del puesto</p>";
    abrirModal();
}
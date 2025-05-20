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


// Mostrar error en el editor
function showEditorError(editorElement) {
    let errorMsg = editorElement.nextElementSibling;

    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
        Swal.fire({
            title: 'campos requeridos',
            text: "Complete por favor todos los campos requeridos.",
            icon: 'warning',
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
                    title: 'campos requeridos',
                    text: "Complete por favor todos los campos requeridos.",
                    icon: 'warning',
                })
            }
        }
        // Validación para inputs normales
        else if (!field.value.trim()) {
            isFieldValid = false;
            Swal.fire({
                title: 'campos requeridos',
                text: "Complete por favor todos los campos requeridos.",
                icon: 'warning',
            })
        }

        // Mostrar error si el campo no es válido
        if (!isFieldValid) {
            field.classList.add('error');
            isValid = false;
            Swal.fire({
                title: 'campos requeridos',
                text: "Complete por favor todos los campos requeridos.",
                icon: 'warning',
            })
        }
    });

    // Validación especial para el editor en el paso 2
    if (step === 1) {
        const textarea = document.getElementById('jobDescription');

        // Validar contenido del textarea
        const contenido = textarea.value.trim();
        const placeholder = textarea.getAttribute('placeholder');

        if (contenido === '' || contenido === placeholder) {
            textarea.classList.add('error');
            showEditorError(textarea);
            isValid = false;

            Swal.fire({
                title: 'Campos requeridos',
                text: "Complete por favor todos los campos requeridos.",
                icon: 'warning',
            });
        }
    }

    // Validar campos requeridos normales
    currentStepElement.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            Swal.fire({
                title: 'campos requeridos',
                text: "Complete por favor todos los campos requeridos.",
                icon: 'warning',
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

    function convertirExperiencia(experiencia) {
        switch (experiencia) {
            case "0":
                return "Sin experiencia";
            case "1":
                return "Menos de 1 año";
            case "2":
                return "Entre 1 y 3 años";
            case "3":
                return "Entre 3 y 5 años";
            case "4":
                return "Entre 5 y 10 años";
            case "5":
                return "Más de 10 años";
            default:
                return "No especificado";
        }
    }

    function convertirEducacion(nivelEducativo) {
        switch (nivelEducativo) {
            case "Sin_estudios":
                return "Sin estudios";
            case "Bachiller":
                return "Bachiller";
            case "Tecnico_Tecnologo":
                return "Técnico/Tecnólogo";
            case "Tecnologo_Universitario":
                return "Tecnólogo o Universitario";
            case "Universitario":
                return "Universitario";
            case "Master":
                return "Máster";
            case "Doctorado":
                return "Doctorado";
            default:
                return "No especificada";
        }
    }

    function convertirTipoEmpleo(tipoEmpleo) {
        switch (tipoEmpleo) {
            case "Tiempo_Completo":
                return "Tiempo completo";
            case "Medio_Tiempo":
                return "Medio tiempo";
            case "Por_oras":
                return "Por horas";
            case "Freelance":
                return "Freelance";
            default:
                return "No especificado";
        }
    }

    function convertirTipoContrato(tipoContrato) {
        switch (tipoContrato) {
            case "Indefinido":
                return "Indefinido";
            case "Fijo":
                return "Fijo";
            case "Obra_labor":
                return "Obra labor";
            case "Practicas":
                return "Prácticas";
            default:
                return "No espeficado";
        }
    }

    // Obtener valores del formulario
    const titulo = document.querySelector('input[name="titulo_puesto"]').value;
    const moneda = document.querySelector('select[name="moneda"]').value;
    const periodo = document.querySelector('select[name="periodo"]').value;
    const modalidad = document.querySelector('select[name="modalidad"]').value;
    const tipoContrato = convertirTipoContrato(document.querySelector('select[name="tipo_contrato"]').value);
    const duracion = document.querySelector('select[name="duracion"]').value;
    const tipoEmpleo = convertirTipoEmpleo(document.querySelector('select[name="tipo_empleo"]').value);
    const experiencia = convertirExperiencia(document.querySelector('select[name="experiencia"]').value);
    const sector = document.querySelector('select[name="sector_oferta"]').value;
    const salario = document.querySelector('input[name="salario"]').value;
    const nivelEstudio = convertirEducacion(document.querySelector('select[name="nivel_educativo"]').value);
    const descripcion = document.querySelector('textarea[name="descripcion"]').value;

    // Insertar los valores en la vista previa (modal)
    document.getElementById("modal-title").innerText = titulo || "Título del puesto";
    document.getElementById("modal-currency").innerText = `(${moneda || "No especificado"})`;
    document.getElementById("modal-period").innerText = `(${periodo || "No especificado"})`;
    document.getElementById("modal-type").innerHTML = `<strong>Tipo de empleo:</strong>${tipoEmpleo}` || "otro";
    document.getElementById("modal-modalidad").innerHTML = `<strong>Modalidad:</strong>${modalidad}` || "No especificado";
    document.getElementById("modal-typeContract").innerHTML = `<strong>Tipo de contrato:</strong>${tipoContrato}` || "No especificado";
    document.getElementById("modal-duration").innerText = `(${duracion || "No especificado"})`;
    document.getElementById("modal-experience").innerHTML = `<strong>Experiencia:</strong>${experiencia}` || "No especificado";
    document.getElementById("modal-sector").innerHTML = `<strong>Sector:</strong>${sector}` || "No especificado";
    document.getElementById("modal-salary").innerHTML = `<strong>Salario:</strong>${salario}` || "No especificado";
    document.getElementById("modal-studyLevel").innerHTML = `<strong>Nivel de estudio:</strong>${nivelEstudio}` || "No especificado";
    document.getElementById("modal-description").innerHTML = descripcion || "<p>Descripción del puesto</p>";
    abrirModal();
}
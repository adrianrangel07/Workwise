document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.offer-content');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');

    // Elementos del modal
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalSalary = document.getElementById('modal-salary');
    const modalDuration = document.getElementById('modal-duration');
    const modalPeriod = document.getElementById('modal-period');
    const modalType = document.getElementById('modal-type');
    const modalModalidad = document.getElementById('modal-modalidad');
    const modalTypeContract = document.getElementById('modal-typeContract');

    // Función para abrir el modal
    const openModal = (card) => {
        // Obtener los datos de la tarjeta
        const title = card.querySelector('h3').innerText;
        const description = card.querySelector('p').innerText;
        const salary = card.querySelector('.salario span').innerText;
        const duration = card.querySelector('.duracion span').innerText;
        const period = card.querySelector('.periodo span').innerText;
        const type = card.querySelector('.tipo_empleo span').innerText;
        const modalidad = card.querySelector('.modalidad span').innerText;
        const typeContract = card.querySelector('.tipo_contrato span').innerText;

        // Obtener el id de la oferta
        const ofertaId = card.getAttribute('data-id'); // Aquí se obtiene el ID del atributo data-id

        // Llenar el modal con los datos de la tarjeta
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalSalary.innerHTML = `<strong>Salary:</strong> ${salary}`;
        modalDuration.innerHTML = `<strong>Duration:</strong> ${duration}`;
        modalPeriod.innerHTML = `<strong>Period:</strong> ${period}`;
        modalType.innerHTML = `<strong>Type of employment:</strong> ${type}`;
        modalModalidad.innerHTML = `<strong>Mode:</strong> ${modalidad}`;
        modalTypeContract.innerHTML = `<strong>Type of contract:</strong> ${typeContract}`;

        // Asignar el ID de la oferta al botón de postulación (de forma segura)
        const postularseBtn = document.getElementById('postularseBtn');
        if (postularseBtn) {
            postularseBtn.setAttribute('data-oferta-id', ofertaId); // Usamos 'data-oferta-id' para evitar problemas con el atributo 'ofertaId'
        }

        // Mostrar el modal
        modal.style.display = 'flex';
    };

    // Agregar evento 'click' a cada tarjeta para abrir el modal
    cards.forEach(card => {
        card.addEventListener('click', function () {
            openModal(card);
        });
    });

    // Cerrar el modal al hacer clic en el botón de cierre
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});

const postularseBtn = document.getElementById('postularseBtn');
postularseBtn.addEventListener("click", function () {
    // Obtener el ID de la oferta desde el botón
    const ofertaId = postularseBtn.getAttribute('data-oferta-id');

    // Obtener el usuarioId desde el campo oculto
    const usuarioId = document.getElementById('usuarioId').value;

    console.log('Oferta ID:', ofertaId, 'Usuario ID:', usuarioId);  // Ver los valores en consola

    if (!ofertaId || !usuarioId) return;  // Verificar que ambos IDs estén presentes

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres postularte a esta oferta?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, postularme'
    }).then((result) => {
        if (result.isConfirmed) {
            // Enviar los datos al backend para comprobar si ya está postulado
            fetch(`/postularse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ofertaId: ofertaId,
                    usuarioId: usuarioId
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Mostrar el mensaje de éxito con un temporizador antes de recargar
                        Swal.fire({
                            title: 'Postulación exitosa',
                            text: data.message,
                            icon: 'success',
                            timer: 3000,  // Establece un temporizador de 3 segundos antes de cerrar
                            showConfirmButton: false // Ocultar el botón de confirmación
                        }).then(() => {
                            postularseBtn.textContent = 'Postulado';
                            postularseBtn.disabled = true;
                            location.reload(); // Recargar la página después de que cierre el mensaje
                        });
                    } else {
                        // Mostrar mensaje si ya está postulado
                        Swal.fire({
                            title: 'Ya estás postulado',
                            text: data.message,
                            icon: 'info',
                            timer: 3000,  // Temporizador de 3 segundos
                            showConfirmButton: false // No mostrar el botón de confirmación
                        }).then(() => {
                            postularseBtn.textContent = 'Postulado';
                            postularseBtn.disabled = true;
                            location.reload(); // Recargar la página después de que cierre el mensaje
                        });
                    }
                })
                .catch(error => {
                    // Mostrar mensaje de error con temporizador
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al postularse. Inténtalo de nuevo más tarde.',
                        icon: 'error',
                        timer: 3000,  // Temporizador de 3 segundos
                        showConfirmButton: false // Ocultar el botón de confirmación
                    }).then(() => {
                        location.reload(); // Recargar la página después de que cierre el mensaje
                    });
                });
        }
    });

});

//no borrar
//codigo para filtrador de busqueda por termino 
document.addEventListener("DOMContentLoaded", function () {
    const formBusqueda = document.getElementById('formBusqueda');
    const terminoInput = document.getElementById('termino');
    const ofertas = document.querySelectorAll('.offer-container .card');

    // Función para normalizar el texto y quitar tildes
    function normalizeText(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    formBusqueda.addEventListener('submit', function (event) {
        event.preventDefault();

        const termino = normalizeText(terminoInput.value); // Normaliza el término de búsqueda
        let ofertasEncontradas = false;

        ofertas.forEach(oferta => {
            const titulo = normalizeText(oferta.querySelector('h3').textContent); // Normaliza el título de la oferta
            if (titulo.includes(termino)) {
                oferta.style.display = 'block';
                ofertasEncontradas = true;
            } else {
                oferta.style.display = 'none';
            }
        });

        if (!ofertasEncontradas) {
            Swal.fire({
                icon: 'warning',
                title: 'No se encontraron ofertas',
                text: 'Por favor, verifica el término de búsqueda.',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                location.reload();
            });
        }

        terminoInput.value = '';
    });
});

//no borrar
//funcion para aplicar filtros
function applyFilters() {
    // Cerrar la barra lateral de filtros desmarcando el checkbox
    document.getElementById('btn-menu').checked = false;

    // Capturar valores de los filtros
    const salarioMin = parseFloat(document.getElementById("salarioMin").value) || 0;
    const salarioMax = parseFloat(document.getElementById("salarioMax").value) || Infinity;
    const tipoEmpleo = document.getElementById("tipoEmpleoSelect").value.toLowerCase();
    const tipoContrato = document.getElementById("typeContract").value.toLowerCase();  // Capturamos el valor del tipo de contrato

    const ofertas = document.querySelectorAll(".offer-container .card");

    // Capturar modalidades seleccionadas
    const checkboxes = document.querySelectorAll('#filterModalidad input[type="checkbox"]');
    const selectedModalities = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());

    let ofertasVisibles = 0; // Contador de ofertas visibles

    // Aplicar los filtros a cada tarjeta de oferta
    ofertas.forEach(oferta => {
        const salario = parseFloat(oferta.querySelector(".salario span").innerText) || 0;
        const tipoEmpleoOferta = oferta.querySelector(".tipo_empleo span").innerText.toLowerCase();
        const modalidadOferta = oferta.querySelector(".modalidad span").innerText.toLowerCase();
        const tipoContratoOferta = oferta.querySelector(".tipo_contrato span").innerText.toLowerCase();

        // Lógica para mostrar/ocultar la oferta según los filtros
        let isVisible = true;

        // Filtramos según los valores de los filtros
        if (salario < salarioMin || salario > salarioMax) isVisible = false;
        if (tipoEmpleo && tipoEmpleo !== tipoEmpleoOferta) isVisible = false;
        if (selectedModalities.length > 0 && !selectedModalities.includes(modalidadOferta)) isVisible = false;
        if (tipoContrato && tipoContrato !== tipoContratoOferta) isVisible = false; // Filtramos por el tipo de contrato

        // Mostrar u ocultar la oferta
        oferta.style.display = isVisible ? "block" : "none";

        if (isVisible) ofertasVisibles++; // Incrementar si la oferta es visible
    });

    // Mostrar alerta si no se encuentran resultados
    if (ofertasVisibles === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No se encontraron resultados',
            text: 'Ninguna oferta coincide con los filtros aplicados. Intenta con otros criterios.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            location.reload();
        });
    }
}

//no borrar
function cerrarSesion(event) {
    event.preventDefault(); // Evitar que se ejecute el href del enlace

    Swal.fire({
        icon: 'success',
        title: 'Cerró sesión exitosamente',
        showConfirmButton: true,
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/'; // Redirigir a la página de inicio
        }
    });
}


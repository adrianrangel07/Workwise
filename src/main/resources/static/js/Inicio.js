
//de aqui en adelante la tarjeta
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.offer-content');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');

    // Elementos del modal
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalSalary = document.getElementById('modal-salary');
    const modalCurrency = document.getElementById('modal-currency');
    const modalDuration = document.getElementById('modal-duration');
    const modalPeriod = document.getElementById('modal-period');
    const modalType = document.getElementById('modal-type');
    const modalModalidad = document.getElementById('modal-modalidad');
    const modalTypeContract = document.getElementById('modal-typeContract');
    const modalEmpresa = document.getElementById('modal-empresa');

    // Función para abrir el modal
    const openModal = (card) => {

        // Obtener los datos de la tarjeta
        const title = card.querySelector('h3').innerText;
        const description = card.querySelector('p').innerText;
        const salary = card.querySelector('.salario span').innerText;
        const currency = card.querySelector('.moneda span').innerText;
        const duration = card.querySelector('.duracion span').innerText;
        const period = card.querySelector('.periodo span').innerText;
        const type = card.querySelector('.tipo_empleo span').innerText;
        const modalidad = card.querySelector('.modalidad span').innerText;
        const typeContract = card.querySelector('.tipo_contrato span').innerText;
        const empresa = card.querySelector('.empresa span').innerText;


        // Llenar el modal con los datos de la tarjeta
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalSalary.innerHTML = `<strong>Salary:</strong> ${salary}`;
        modalCurrency.innerHTML = `<strong>moneda:</strong> ${currency}`;
        modalDuration.innerHTML = `<strong>Duración:</strong> ${duration}`;
        modalPeriod.innerHTML = `<strong>Periodo:</strong> ${period}`;
        modalType.innerHTML = `<strong>Tipo de empleo:</strong> ${type}`;
        modalModalidad.innerHTML = `<strong>Modalidad:</strong> ${modalidad}`;
        modalTypeContract.innerHTML = `<strong>tipo de contrato:</strong> ${typeContract}`;
        modalEmpresa.innerHTML = `<strong>Empresa:</strong> ${empresa}`;

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
        const tipoContratoOferta = oferta.querySelector(".tipo_contrato span").innerText.toLowerCase(); // Asumiendo que hay una clase 'tipo_contrato' en la tarjeta de oferta

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

document.addEventListener('DOMContentLoaded', function () {
    const postularseBtn = document.getElementById('postularseBtn');

    postularseBtn.addEventListener('click', function () {
        Swal.fire({
            icon: 'info',
            title: 'Debes iniciar sesión primero',
            text: 'Por favor, inicia sesión para poder postularte.',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Return',
            position: "center",
            color: "#000",
            width: "30%",
            padding: "1rem",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login/personas'; // Redirige a la página de inicio de sesión
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".salario span").forEach(function (element) {
        let value = element.textContent.trim();
        if (!isNaN(value) && value !== "") {
            element.textContent = Number(value).toLocaleString("es-CO");
        }
    });
});

document.getElementById("ocultarNavBar").addEventListener("click", function () {
    let sidebar = document.querySelector(".sidebar");

    // Alternar la clase "toggled" en la barra lateral
    sidebar.classList.toggle("toggled");
    // sidebar.classList.toggle("sidebar");
});

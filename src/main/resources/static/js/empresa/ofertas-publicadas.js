document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.offer-content');

    // Elementos de la sección 2
    const detalleTitulo = document.getElementById('detalle-titulo');
    const detalleDescripcion = document.getElementById('detalle-descripcion');
    const detalleSalario = document.getElementById('detalle-salario');
    const detalleMoneda = document.getElementById('detalle-moneda');
    const detalleDuracion = document.getElementById('detalle-duracion');
    const detallePeriodo = document.getElementById('detalle-periodo');
    const detalleModalidad = document.getElementById('detalle-modalidad');
    const detalleTipo = document.getElementById('detalle-tipo');
    const detalleTipoContrato = document.getElementById('detalle-tipoContrato');

    // Función para mostrar los detalles en la Sección 2
    const mostrarDetalles = (card) => {
        const idOferta = card.getAttribute("data-id"); // Obtener ID de la oferta

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

        // Llenar la Sección 2 con los datos de la tarjeta
        detalleTitulo.innerText = title;
        detalleDescripcion.innerText = description;
        detalleSalario.innerHTML = `<strong>Salario:</strong> ${salary}`;
        detalleMoneda.innerHTML = `<strong>Moneda:</strong> ${currency}`;
        detalleDuracion.innerHTML = `<strong>Duración:</strong> ${duration}`;
        detallePeriodo.innerHTML = `<strong>Periodo:</strong> ${period}`;
        detalleModalidad.innerHTML = `<strong>Modalidad:</strong> ${modalidad}`;
        detalleTipo.innerHTML = `<strong>Tipo de empleo:</strong> ${type}`;
        detalleTipoContrato.innerHTML = `<strong>Tipo de contrato:</strong> ${typeContract}`;

        cargarPostulaciones(idOferta);
    };

    // Agregar evento 'click' a cada tarjeta para mostrar la información en la Sección 2
    cards.forEach(card => {
        card.addEventListener('click', function () {
            mostrarDetalles(card);
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

function cargarPostulaciones(idOferta) {
    fetch(`/ofertas/${idOferta}/postulaciones`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data); // Ver qué llega desde el backend

            if (!Array.isArray(data)) {
                console.error("Respuesta no es un array:", data);
                return;
            }

            let listaPostulantes = document.getElementById("lista-postulantes");
            listaPostulantes.innerHTML = ""; // Limpiar lista previa

            data.forEach(postulante => {
                let li = document.createElement("li");
                li.classList.add("postulante-item");

                let btnVerCV = document.createElement("button");

                btnVerCV.innerText = "Ver CV";
                btnVerCV.classList.add("btn-ver-cv");

                if (postulante.id) {  
                    btnVerCV.onclick = function () {
                        abrirModal(`/postulantes/${postulante.id}/verHDV`);
                    };
                } else {
                    btnVerCV.disabled = true; 
                }

                li.textContent = `${postulante.nombre} ${postulante.apellido} `;
                li.appendChild(btnVerCV);
                listaPostulantes.appendChild(li);
            });
        })
        .catch(error => console.error("Error cargando postulaciones:", error));
}



// Función para abrir el modal con el PDF
function abrirModal(pdfUrl) {
    let modal = document.getElementById("modalCV");
    let iframe = document.getElementById("iframeCV");

    iframe.src = pdfUrl;
    modal.style.display = "block";
}

// Función para cerrar el modal
function cerrarModal() {
    let modal = document.getElementById("modalCV");
    modal.style.display = "none";
    document.getElementById("iframeCV").src = ""; // Limpiar el src
}

// Cerrar el modal si el usuario hace clic fuera del contenido
window.onclick = function (event) {
    let modal = document.getElementById("modalCV");
    if (event.target === modal) {
        cerrarModal();
    }
};


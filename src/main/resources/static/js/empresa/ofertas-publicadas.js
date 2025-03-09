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

// Función para abrir el modal con el PDF
function abrirModal(pdfUrl, idPostulacion) {
    let modal = document.getElementById("modalCV");
    let iframe = document.getElementById("iframeCV");

    iframe.src = pdfUrl;
    modal.style.display = "flex"
    modal.style.alignItems = "center"
    modal.style.justifyContent = "center"
    document.getElementById("postulacionId").value = idPostulacion; // Almacena correctamente el ID
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

function obtenerIdPostulacion() {
    let id = document.getElementById("postulacionId").value;
    return id;
}

function accionAceptado() {
    let idPostulacion = obtenerIdPostulacion();
    cambiarEstadoPostulacion(idPostulacion, 'aceptado');
}

function accionRechazado() {
    let idPostulacion = obtenerIdPostulacion();
    cambiarEstadoPostulacion(idPostulacion, 'rechazado');
}

function cambiarEstadoPostulacion(idPostulacion, nuevoEstado) {
    console.log("ID de la postulación que se enviará:", idPostulacion); 
    console.log("Nuevo estado que se enviará:", nuevoEstado);

    if (!idPostulacion || isNaN(idPostulacion)) {  // Verifica si el ID es válido
        console.error("Error: idPostulacion es inválido:", idPostulacion);
        return;
    }

    fetch(`/postulaciones/${idPostulacion}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }) 
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(err => { throw new Error(err); });
        }
        return response.text();
    })
    .then(message => {
        alert(message);
        cerrarModal();
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}

function cargarPostulaciones(idOferta) {
    fetch(`/ofertas/${idOferta}/postulaciones`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);

            if (!Array.isArray(data)) {
                console.error("Respuesta no es un array:", data);
                return;
            }

            let listaPostulantes = document.getElementById("lista-postulantes");
            listaPostulantes.innerHTML = "";

            data.forEach(postulante => {
                let li = document.createElement("li");
                li.classList.add("postulante-item");

                let btnVerCV = document.createElement("button");
                btnVerCV.innerText = "Ver CV";
                btnVerCV.classList.add("btn-ver-cv");

                if (postulante.id) {
                    btnVerCV.onclick = function () {
                        console.log("Clic en Ver CV - ID:", postulante.id);
                        document.getElementById("postulacionId").value = postulante.id;
                        abrirModal(`/postulantes/${postulante.id}/verHDV`, postulante.id);
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

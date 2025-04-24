
document.addEventListener('DOMContentLoaded', function () {
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
        let idOferta = card.getAttribute("data-id"); // Obtener ID de la oferta

        if (!idOferta || idOferta === "null" || idOferta === "undefined") {
            console.error("❌ ID de oferta inválido:", idOferta);
            return;
        }

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

// Función para cambiar estado de postulación
function cambiarEstadoPostulacion(idPostulacion, nuevoEstado) {
    if (!idPostulacion || idPostulacion === "null" || idPostulacion === "undefined") {
        console.error("❌ Error: ID de postulación inválido:", idPostulacion);
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
    .catch(error => console.error('Error al actualizar el estado:', error));
}

// Función para cargar postulaciones de una oferta
function cargarPostulaciones(idOferta) {
    if (!idOferta || idOferta === "null" || idOferta === "undefined") {
        console.error("❌ Error: ID de oferta inválido:", idOferta);
        return;
    }

    fetch(`/ofertas/${idOferta}/postulaciones`)
        .then(response => response.json())
        .then(data => {
            console.log("✅ Datos de postulaciones recibidos:", data);

            let listaPostulantes = document.getElementById("lista-postulantes");
            listaPostulantes.innerHTML = "";

            data.forEach(postulante => {
                let li = document.createElement("li");
                li.classList.add("postulante-item");
                li.innerHTML = `${postulante.nombre} ${postulante.apellido} `;

                let btnVerCV = document.createElement("button");
                btnVerCV.innerText = "Ver CV";
                btnVerCV.classList.add("btn-ver-cv");
                btnVerCV.setAttribute("data-postulacion-id", postulante.postulacionId);

                btnVerCV.addEventListener("click", function () {
                    let id = this.getAttribute("data-postulacion-id");

                    if (!id || id === "null" || id === "undefined") {
                        console.error("❌ Error: ID de postulación inválido al abrir CV:", id);
                        return;
                    }

                    console.log("📄 Abriendo CV - ID de postulación:", id);
                    document.getElementById("postulacionId").value = id;
                    abrirModal(`/postulantes/${id}/verHDV`, id);
                });

                li.appendChild(btnVerCV);
                listaPostulantes.appendChild(li);
            });
        })
        .catch(error => console.error("❌ Error cargando postulaciones:", error));
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-ver-cv")) {
        let idPostulacion = event.target.getAttribute("data-postulacion-id");
        console.log("📌 Evento global detectado: ID de postulación:", idPostulacion);
        document.getElementById("postulacionId").value = idPostulacion;
        abrirModal(`/postulantes/${idPostulacion}/verHDV`, idPostulacion);
    }
});

function abrirModal(pdfUrl, idPostulacion) {
    let modal = document.getElementById("modalCV");
    let iframe = document.getElementById("iframeCV");

    if (!pdfUrl || !idPostulacion) {
        console.error("❌ Error: La URL del PDF o el ID de postulación están vacíos.");
        return;
    }

    console.log("✅ Abriendo modal con PDF:", pdfUrl); // 🧐 Verifica en consola

    iframe.src = pdfUrl; // Asegura que se carga correctamente el PDF
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    document.getElementById("postulacionId").value = idPostulacion;
}


// Función para cerrar el modal
function cerrarModal() {
    let modal = document.getElementById("modalCV");
    modal.style.display = "none";
    document.getElementById("iframeCV").src = ""; 
}

// Cerrar el modal si el usuario hace clic fuera del contenido
window.onclick = function (event) {
    let modal = document.getElementById("modalCV");
    if (event.target === modal) {
        cerrarModal();
    }
};

function accionAceptado() {
    let idPostulacion = document.getElementById("postulacionId").value;
    console.log("ID obtenido antes de enviar:", idPostulacion); // 👀 Para depuración
    cambiarEstadoPostulacion(idPostulacion, 'aceptado');
}

function accionRechazado() {
    let idPostulacion = document.getElementById("postulacionId").value;
    console.log("ID obtenido antes de enviar:", idPostulacion); // 👀 Para depuración
    cambiarEstadoPostulacion(idPostulacion, 'rechazado');
}

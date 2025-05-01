
function getStatusText(status) {
    if (!status) return 'Pendiente';
    switch (status.toLowerCase()) {
        case 'aceptado': return 'Aceptado';
        case 'rechazado': return 'Rechazado';
        case 'pendiente': return 'Pendiente';
        default: return status;
    }
}

// Función global para cargar postulaciones
function cargarPostulaciones(idOferta, filter = 'all') {
    const listaPostulantes = document.getElementById("lista-postulantes");
    const emptyApplicants = document.getElementById("empty-applicants");

    if (!idOferta) return;

    // Añadir timestamp para evitar caché
    fetch(`/ofertas/${idOferta}/postulaciones?t=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar postulaciones');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos de postulaciones:", data);

            listaPostulantes.innerHTML = "";

            if (data.length === 0) {
                emptyApplicants.style.display = 'block';
                return;
            }

            emptyApplicants.style.display = 'none';

            // Asegurar que cada postulante tenga estado
            const postulantesConEstado = data.map(postulante => ({
                ...postulante,
                estado: postulante.estado || 'pendiente'
            }));

            // Filtrar según el filtro seleccionado
            const filteredData = filter === 'all' ? postulantesConEstado :
                postulantesConEstado.filter(p => p.estado.toLowerCase() === filter.toLowerCase());

            filteredData.forEach(postulante => {
                const li = document.createElement("li");
                li.className = "postulante-item";

                const initials = `${postulante.nombre.charAt(0)}${postulante.apellido.charAt(0)}`.toUpperCase();

                li.innerHTML = `
                    <div class="postulante-info">
                        <div class="postulante-avatar">${initials}</div>
                        <div>
                            <div class="postulante-name">${postulante.nombre} ${postulante.apellido}</div>
                            <div class="postulante-status status-${postulante.estado.toLowerCase()}">
                                ${getStatusText(postulante.estado)}
                            </div>
                        </div>
                    </div>
                    <button class="btn-ver-cv" data-postulacion-id="${postulante.postulacionId}" 
                            data-applicant-name="${postulante.nombre} ${postulante.apellido}"
                            data-current-status="${postulante.estado}">
                        <i class="fas fa-file-pdf"></i> Ver CV
                    </button>
                `;

                listaPostulantes.appendChild(li);
            });

            // Agregar event listeners
            document.querySelectorAll('.btn-ver-cv').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.getAttribute('data-postulacion-id');
                    const name = this.getAttribute('data-applicant-name');
                    const status = this.getAttribute('data-current-status');

                    document.getElementById('postulacionId').value = id;
                    abrirModal(`/postulaciones/${id}/verHDV`, id, name, status);
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
            showNotification('Error al cargar postulaciones', 'error');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.offer-content');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Elementos de la sección de detalles
    const offerDetails = document.getElementById('offer-details');
    const detalleTitulo = document.getElementById('detalle-titulo');
    const detalleDescripcion = document.getElementById('detalle-descripcion');
    const listaPostulantes = document.getElementById('lista-postulantes');
    const emptyApplicants = document.getElementById('empty-applicants');

    // Función para formatear salario
    const formatSalary = (value) => {
        return !isNaN(value) && value !== "" ? Number(value).toLocaleString("es-CO") : value;
    };

    // Mostrar detalles de la oferta
    const mostrarDetalles = (card) => {
        let idOferta = card.getAttribute("data-id");

        if (!idOferta || idOferta === "null" || idOferta === "undefined") {
            console.error("❌ ID de oferta inválido:", idOferta);
            return;
        }

        // Obtener datos de la tarjeta
        const title = card.querySelector('h3').innerText;
        const description = card.querySelector('.offer-description').innerText;
        const salary = card.querySelector('.salario span').innerText;
        const currency = card.querySelector('.moneda span')?.innerText || '';
        const duration = card.querySelector('.duracion span').innerText;
        const period = card.querySelector('.periodo span')?.innerText || '';
        const type = card.querySelector('.tipo_empleo span').innerText;
        const modality = card.querySelector('.modalidad span').innerText;
        const typeContract = card.querySelector('.tipo_contrato span').innerText;

        // Actualizar sección de detalles
        detalleTitulo.innerText = title;
        detalleDescripcion.innerText = description;

        // Crear grid de detalles
        offerDetails.innerHTML = `
            <div class="detail-item">
                <strong><i class="fas fa-money-bill-wave"></i> Salario</strong>
                <span>${formatSalary(salary)} ${currency}</span>
            </div>
            <div class="detail-item">
                <strong><i class="fas fa-clock"></i> Duración</strong>
                <span>${duration} ${period}</span>
            </div>
            <div class="detail-item">
                <strong><i class="fas fa-briefcase"></i> Tipo de empleo</strong>
                <span>${type}</span>
            </div>
            <div class="detail-item">
                <strong><i class="fas fa-laptop-house"></i> Modalidad</strong>
                <span>${modality}</span>
            </div>
            <div class="detail-item">
                <strong><i class="fas fa-file-signature"></i> Tipo de contrato</strong>
                <span>${typeContract}</span>
            </div>
            <div class="detail-item">
                <strong><i class="fas fa-calendar-alt"></i> Fecha publicación</strong>
                <span>${new Date().toLocaleDateString()}</span>
            </div>
        `;

        // Resaltar tarjeta seleccionada
        cards.forEach(c => {
            c.closest('.card').classList.remove('selected');
        });
        card.closest('.card').classList.add('selected');

        cargarPostulaciones(idOferta);
    };

    // Eventos para filtrar postulantes
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            const selectedCard = document.querySelector('.card.selected');

            if (selectedCard) {
                const idOferta = selectedCard.querySelector('.offer-content').getAttribute('data-id');
                cargarPostulaciones(idOferta, filter);
            }
        });
    });

    // Eventos para las tarjetas de ofertas
    cards.forEach(card => {
        card.addEventListener('click', function () {
            mostrarDetalles(card);
        });
    });

    // Mostrar la primera oferta por defecto si existe
    if (cards.length > 0) {
        mostrarDetalles(cards[0]);
    }
});

// Función para abrir modal con más información
function abrirModal(pdfUrl, idPostulacion, applicantName, currentStatus) {
    const modal = document.getElementById("modalCV");
    const iframe = document.getElementById("iframeCV");

    if (!idPostulacion) {
        console.error("❌ Error: ID de postulación inválido");
        return;
    }

    // URL correcta para el PDF basada en el controlador
    const urlPdf = `/postulaciones/${idPostulacion}/verHDV`;
    console.log("URL del PDF:", urlPdf);

    // Actualizar información del modal
    document.getElementById("applicant-name").textContent = `CV de ${applicantName}`;

    // Actualizar estado actual
    const statusBadge = document.getElementById("current-status");
    statusBadge.textContent = getStatusText(currentStatus);
    statusBadge.className = `status-badge status-${currentStatus || 'pendiente'}`;

    iframe.src = urlPdf;
    modal.style.display = "flex";
    document.getElementById("postulacionId").value = idPostulacion;
}

// Resto de funciones (sin cambios)
function cerrarModal() {
    document.getElementById("modalCV").style.display = "none";
    document.getElementById("iframeCV").src = "";
}

window.onclick = function (event) {
    const modal = document.getElementById("modalCV");
    if (event.target === modal) {
        cerrarModal();
    }
};

function cambiarEstadoPostulacion(idPostulacion, nuevoEstado) {
    if (!idPostulacion) {
        showNotification('ID de postulación inválido', 'error');
        return;
    }

    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    const headers = {
        'Content-Type': 'application/json'
    };

    if (csrfToken && csrfHeader) {
        headers[csrfHeader] = csrfToken;
    }

    // Mostrar indicador de carga
    const modalButtons = document.querySelector('.modal-buttons');
    const originalButtons = modalButtons.innerHTML;
    modalButtons.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';

    fetch(`/postulaciones/${idPostulacion}/estado`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ estado: nuevoEstado })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || err.message || 'Error al actualizar'); });
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                throw new Error(data.message || 'Error en la respuesta');
            }

            showNotification(`Estado actualizado a ${getStatusText(nuevoEstado)}`, 'success');

            // Actualizar el modal
            const statusBadge = document.getElementById('current-status');
            if (statusBadge) {
                statusBadge.textContent = getStatusText(nuevoEstado);
                statusBadge.className = `status-badge status-${nuevoEstado.toLowerCase()}`;
            }

            // Actualizar el estado en la lista
            updateApplicantStatusInList(idPostulacion, nuevoEstado);

            // Forzar recarga de los datos del servidor después de 1 segundo
            setTimeout(() => {
                const selectedCard = document.querySelector('.card.selected');
                if (selectedCard) {
                    const idOferta = selectedCard.querySelector('.offer-content').getAttribute('data-id');
                    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    cargarPostulaciones(idOferta, activeFilter);
                }
                cerrarModal();
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification(error.message, 'error');
            // Restaurar botones originales
            modalButtons.innerHTML = originalButtons;
        });
}

// Función mejorada para actualizar el estado en la lista
function updateApplicantStatusInList(postulacionId, nuevoEstado) {
    const applicants = document.querySelectorAll('.postulante-item');

    applicants.forEach(applicant => {
        const btn = applicant.querySelector('.btn-ver-cv');
        if (btn && btn.getAttribute('data-postulacion-id') == postulacionId.toString()) {
            // Actualizar el estado en el botón
            btn.setAttribute('data-current-status', nuevoEstado);

            // Actualizar el badge de estado
            const statusBadge = applicant.querySelector('.postulante-status');
            if (statusBadge) {
                statusBadge.textContent = getStatusText(nuevoEstado);
                statusBadge.className = `postulante-status status-${nuevoEstado.toLowerCase()}`;
            }
        }
    });
}

function accionAceptado() {
    const idPostulacion = document.getElementById("postulacionId").value;
    cambiarEstadoPostulacion(idPostulacion, 'aceptado');
}

function accionRechazado() {
    const idPostulacion = document.getElementById("postulacionId").value;
    cambiarEstadoPostulacion(idPostulacion, 'rechazado');
}

// Función para mostrar notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Añadir estilos para notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification.success {
        background: #28a745;
    }
    
    .notification.error {
        background: #dc3545;
    }
`;
document.head.appendChild(style);
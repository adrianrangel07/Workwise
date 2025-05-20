document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const cards = document.querySelectorAll('.offer-content');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const editForm = document.getElementById('edit-form');
    const postCount = document.getElementById('postCount');
    const formBusqueda = document.getElementById('formBusqueda');

    // Elementos del modal
    const modalElements = {
        title: document.getElementById('modal-title'),
        description: document.getElementById('modal-description'),
        salary: document.getElementById('modal-salary'),
        currency: document.getElementById('modal-currency'),
        duration: document.getElementById('modal-duration'),
        period: document.getElementById('modal-period'),
        type: document.getElementById('modal-type'),
        modalidad: document.getElementById('modal-modalidad'),
        typeContract: document.getElementById('modal-typeContract'),
        experience: document.getElementById('modal-experience'),
        educationLevel: document.getElementById('modal-educationLevel'),
        sector_oferta: document.getElementById('modal-sector_oferta')
    };

    // Campos del formulario de edición
    const editFields = {
        title: document.getElementById('edit-title'),
        description: document.getElementById('edit-description'),
        salary: document.getElementById('edit-salary'),
        currency: document.getElementById('edit-currency'),
        duration: document.getElementById('edit-duration'),
        period: document.getElementById('edit-period'),
        modalidad: document.getElementById('edit-modalidad'),
        type: document.getElementById('edit-type'),
        typeContract: document.getElementById('edit-typeContract'),
        experience: document.getElementById('edit-experience'),
        educationLevel: document.getElementById('edit-educationLevel'),
        sector_oferta: document.getElementById('edit-sector_oferta')
    };

    let currentOfferId = null;

    // ==================== FUNCIONES PRINCIPALES ====================

    function openModal(card) {
        currentOfferId = card.getAttribute('data-id');
        const isDisabled = card.closest('.card').classList.contains('disabled-offer');

        // Limpiar botones anteriores del modal
        const modalButtons = document.querySelector('.modal-buttons');
        modalButtons.innerHTML = '';

        // 1. Botón de habilitar/deshabilitar
        const toggleButton = document.createElement('button');
        toggleButton.className = `btn ${isDisabled ? 'btn-success' : 'btn-warning'}`;
        toggleButton.innerHTML = `<i class="fas ${isDisabled ? 'fa-check-circle' : 'fa-ban'}"></i> ${isDisabled ? 'Habilitar' : 'Deshabilitar'}`;
        toggleButton.onclick = () => toggleOfferStatus(currentOfferId, isDisabled);
        modalButtons.appendChild(toggleButton);

        // 2. Botón de Editar (solo si está habilitada)
        if (!isDisabled) {
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary';
            editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
            editButton.onclick = prepareEditForm;
            modalButtons.appendChild(editButton);
        }

        // 3. Botón de Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
        deleteButton.onclick = confirmDeleteOffer;
        modalButtons.appendChild(deleteButton);

        // 4. Botón de Más Detalles
        const infoButton = document.createElement('button');
        infoButton.className = 'btn btn-success';
        infoButton.innerHTML = '<i class="fas fa-info-circle"></i> Más detalles';
        infoButton.onclick = () => window.location.href = "/empresas/published-offers";
        modalButtons.appendChild(infoButton);

        // Llenar el modal con los datos
        fillModalWithCardData(card);

        // Mostrar número de postulaciones
        mostrarPostulaciones(currentOfferId);

        // Mostrar el modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function fillModalWithCardData(card) {
        const cardData = {
            title: card.querySelector('h3').textContent,
            description: card.querySelector('p:not(.visible-info p)').textContent,
            salary: card.querySelector('.hidden-info p:nth-child(1) span').textContent,
            currency: card.querySelector('.hidden-info p:nth-child(2) span').textContent,
            duration: card.querySelector('.hidden-info p:nth-child(3) span').textContent,
            period: card.querySelector('.hidden-info p:nth-child(4) span').textContent,
            employmentType: card.querySelector('.hidden-info p:nth-child(5) span').textContent,
            modality: card.querySelector('.hidden-info p:nth-child(6) span').textContent,
            contractType: card.querySelector('.hidden-info p:nth-child(7) span').textContent,
            experience: card.querySelector('.hidden-info p:nth-child(8) span').textContent,
            educationLevel: card.querySelector('.hidden-info p:nth-child(9) span').textContent,
            sector_oferta: card.querySelector('.hidden-info p:nth-child(10) span').textContent
        };

        modalElements.title.textContent = cardData.title;
        modalElements.description.textContent = cardData.description;
        modalElements.salary.innerHTML = `<strong>Salario:</strong> ${cardData.salary}`;
        modalElements.currency.innerHTML = `<strong>Moneda:</strong> ${cardData.currency}`;
        modalElements.duration.innerHTML = `<strong>Duración:</strong> ${cardData.duration}`;
        modalElements.period.innerHTML = `<strong>Periodo:</strong> ${cardData.period}`;
        modalElements.type.innerHTML = `<strong>Tipo de empleo:</strong> ${cardData.employmentType}`;
        modalElements.modalidad.innerHTML = `<strong>Modalidad:</strong> ${cardData.modality}`;
        modalElements.typeContract.innerHTML = `<strong>Tipo de contrato:</strong> ${cardData.contractType}`;
        modalElements.experience.innerHTML = `<strong>Experiencia:</strong> ${cardData.experience}`;
        modalElements.educationLevel.innerHTML = `<strong>Nivel educativo:</strong> ${cardData.educationLevel}`;
        modalElements.sector_oferta.innerHTML = `<strong>Sector de oferta:</strong> ${cardData.sector_oferta}`;
    }

    async function toggleOfferStatus(id, isCurrentlyDisabled) {
        try {
            const response = await fetch(`/ofertas/${id}/toggle-habilitar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText || 'Error al cambiar estado');
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: `Oferta ${isCurrentlyDisabled ? 'habilitada' : 'deshabilitada'} correctamente`,
                timer: 1500
            });

            location.reload();
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al cambiar el estado'
            });
        }
    }

    function prepareEditForm() {
        // Ocultar elementos del modal de visualización
        Object.values(modalElements).forEach(el => el.style.display = 'none');
        document.querySelectorAll('.modal-buttons button').forEach(btn => btn.style.display = 'none');
        postCount.style.display = 'none';

        // Mostrar formulario de edición
        editForm.style.display = 'block';

        // Autorellenar el formulario
        editFields.title.value = modalElements.title.textContent.trim();
        editFields.description.value = modalElements.description.textContent.trim();

        // Extraer y formatear el salario
        const rawSalary = modalElements.salary.textContent
            .replace('Salario: ', '')
            .replace(/[^0-9]/g, '');
        editFields.salary.value = rawSalary;

        // Autorellenar los selects
        editFields.currency.value = getValueFromModal(modalElements.currency, 'Moneda: ');
        editFields.duration.value = getValueFromModal(modalElements.duration, 'Duración: ');
        editFields.period.value = getValueFromModal(modalElements.period, 'Periodo: ');
        editFields.modalidad.value = getValueFromModal(modalElements.modalidad, 'Modalidad: ');
        editFields.type.value = getValueFromModal(modalElements.type, 'Tipo de empleo: ');
        editFields.typeContract.value = getValueFromModal(modalElements.typeContract, 'Tipo de contrato: ');
        editFields.experience.value = getValueFromModal(modalElements.experience, 'Experiencia: ');
        editFields.educationLevel.value = getValueFromModal(modalElements.educationLevel, 'Nivel educativo: ');
        editFields.sector_oferta.value = getValueFromModal(modalElements.sector_oferta, 'Sector de oferta: ');

        // Enfocar el primer campo
        editFields.title.focus();
    }

    function confirmDeleteOffer() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOffer(currentOfferId);
            }
        });
    }

    async function deleteOffer(id) {
        try {
            const response = await fetch(`/offers/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Operación exitosa',
                showConfirmButton: false,
                timer: 1500
            });

            location.reload();
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al procesar la solicitud'
            });
        }
    }

    // ==================== FUNCIONES AUXILIARES ====================

    function getValueFromModal(element, prefix) {
        return element.textContent.replace(prefix, '').trim();
    }

    function mostrarPostulaciones(idOferta) {
        fetch(`/ofertas/${idOferta}/postulaciones/count`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener postulaciones');
                return response.json();
            })
            .then(data => {
                const count = typeof data === 'number' ? data : 0;
                document.getElementById('postulaciones-count').textContent =
                    `${count} ${count === 1 ? 'persona se ha postulado' : 'personas se han postulado'}`;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('postulaciones-count').textContent = 'No disponible';
            });
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // ==================== EVENT LISTENERS ====================

    // Event listeners para las tarjetas
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.closest('button')) {
                openModal(card);
            }
        });
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Guardar cambios en edición
    document.getElementById('save-button').addEventListener('click', async function () {
        // Validar campos obligatorios
        if (!editFields.title.value || !editFields.description.value || !editFields.salary.value) {
            await Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos obligatorios'
            });
            return;
        }

        try {
            const updatedOffer = {
                id: currentOfferId,
                titulo_puesto: editFields.title.value,
                descripcion: editFields.description.value,
                salario: parseInt(editFields.salary.value),
                moneda: editFields.currency.value,
                duracion: editFields.duration.value,
                periodo: editFields.period.value,
                modalidad: editFields.modalidad.value,
                tipo_empleo: editFields.type.value,
                tipo_contrato: editFields.typeContract.value,
                nivel_educativo: editFields.educationLevel.value,
                experiencia: parseInt(editFields.experience.value) || 0,
                sector_oferta: editFields.sector_oferta.value
            };

            const response = await fetch(`/offers/edit/${currentOfferId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOffer)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar la oferta');
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: result.message || 'Los cambios se guardaron correctamente',
                timer: 1500
            });

            location.reload();
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un problema al guardar los cambios'
            });
        }
    });

    // Cancelar edición
    document.getElementById('cancel-button').addEventListener('click', function () {
        location.reload();
    });

    // Búsqueda de ofertas
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function (e) {
            e.preventDefault();
            const termino = normalizeText(document.getElementById('termino').value);
            const ofertas = document.querySelectorAll('.offer-container .card');
            let ofertasEncontradas = false;

            ofertas.forEach(oferta => {
                const titulo = normalizeText(oferta.querySelector('h3').textContent);
                oferta.style.display = titulo.includes(termino) ? 'block' : 'none';
                if (titulo.includes(termino)) ofertasEncontradas = true;
            });

            if (!ofertasEncontradas) {
                Swal.fire({
                    icon: 'info',
                    title: 'No hay resultados',
                    text: 'No se encontraron ofertas que coincidan con tu búsqueda',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                });
            }
        });
    }

    // Función para normalizar texto de búsqueda
    function normalizeText(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Cargar foto de perfil
    const userAvatar = document.getElementById("user-avatar");
    fetch("/empresas/photo")
        .then(response => {
            if (!response.ok) throw new Error('Foto no encontrada');
            return response.blob();
        })
        .then(blob => {
            userAvatar.src = URL.createObjectURL(blob);
        })
        .catch(() => {
            userAvatar.src = "../Imagenes/imagenempresa.png";
        });

    // Formatear salarios
    document.querySelectorAll(".hidden-info p strong").forEach(el => {
        if (el.textContent.trim().toLowerCase().includes('salario')) {
            const value = el.nextElementSibling.textContent.trim();
            if (!isNaN(value.replace(/[^0-9]/g, ''))) {
                el.nextElementSibling.textContent =
                    Number(value.replace(/[^0-9]/g, '')).toLocaleString("es-CO");
            }
        }
    });
});

// Función global para cerrar sesión
function cerrarSesion(event) {
    event.preventDefault();
    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        window.location.href = '/';
    });
}
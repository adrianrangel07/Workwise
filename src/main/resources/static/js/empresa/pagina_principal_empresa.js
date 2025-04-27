
// de aqui en adelante la tarjeta
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
    const modalExperience = document.getElementById('modal-experience');
    const modalEducationLevel = document.getElementById('modal-educationLevel');

    // Función para abrir el modal
    const openModal = (card) => {

        const offerId = card.getAttribute('data-id'); // Obtener el ID de la oferta
        modal.setAttribute('data-offer-id', offerId); // Asignarlo al modal

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
        const experience = card.querySelector('.experiencia span').innerText;
        const educationLevel = card.querySelector('.nivel_educativo span').innerText;

        // Llenar el modal con los datos de la tarjeta
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalSalary.innerHTML = `<strong>Salario:</strong> ${salary}`;
        modalCurrency.innerHTML = `<strong>Moneda:</strong> ${currency}`;
        modalDuration.innerHTML = `<strong>Duración:</strong> ${duration}`;
        modalPeriod.innerHTML = `<strong>Periodo:</strong> ${period}`;
        modalType.innerHTML = `<strong>Tipo de empleo:</strong> ${type}`;
        modalModalidad.innerHTML = `<strong>Modalidad:</strong> ${modalidad}`;
        modalTypeContract.innerHTML = `<strong>Tipo de contrato:</strong> ${typeContract}`;
        modalExperience.innerHTML = `<strong>Experiencia:</strong> ${experience}`;
        modalEducationLevel.innerHTML = `<strong>Nivel educativo:</strong> ${educationLevel}`;

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

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.offer-content');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalSalary = document.getElementById('modal-salary');
    const modalCurrency = document.getElementById('modal-currency');
    const modalDuration = document.getElementById('modal-duration');
    const modalPeriod = document.getElementById('modal-period');
    const modalType = document.getElementById('modal-type');
    const modalModalidad = document.getElementById('modal-modalidad');
    const modalTypeContract = document.getElementById('modal-typeContract');
    const modalExperience = document.getElementById('modal-experience');
    const modalEducationLevel = document.getElementById('modal-educationLevel');


    const editForm = document.getElementById('edit-form');
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const deleteButton = document.getElementById('delete-button');
    const postCount = document.getElementById('postCount');
    const infoButton = document.getElementById('info-button');

    const editTitle = document.getElementById('edit-title');
    const editDescription = document.getElementById('edit-description');
    const editCurrency = document.getElementById('edit-currency');
    const editSalary = document.getElementById('edit-salary');
    const editDuration = document.getElementById('edit-duration');
    const editPeriod = document.getElementById('edit-period');
    const editModalidad = document.getElementById('edit-modalidad');
    const editType = document.getElementById('edit-type');
    const editTypeContract = document.getElementById('edit-typeContract');

    let currentOfferId = null;

    // Función para abrir el modal con la oferta
    const openModal = (card) => {
        currentOfferId = card.getAttribute('data-id'); // Obtener el ID de la oferta

        // Llenar el modal con los datos actuales
        modalTitle.innerText = card.querySelector('h3').innerText;
        modalDescription.innerText = card.querySelector('p').innerText;
        modalSalary.innerHTML = `<strong>Salario:</strong> ${card.querySelector('.salario span').innerText}`;
        modalCurrency.innerHTML = `<strong>Moneda:</strong> ${card.querySelector('.moneda span').innerText}`;
        modalDuration.innerHTML = `<strong>Duración:</strong> ${card.querySelector('.duracion span').innerText}`;
        modalPeriod.innerHTML = `<strong>Periodo:</strong> ${card.querySelector('.periodo span').innerText}`;
        modalType.innerHTML = `<strong>Tipo de empleo:</strong> ${card.querySelector('.tipo_empleo span').innerText}`;
        modalModalidad.innerHTML = `<strong>Modalidad:</strong> ${card.querySelector('.modalidad span').innerText}`;
        modalTypeContract.innerHTML = `<strong>tipo de contrato:</strong> ${card.querySelector('.tipo_contrato span').innerText}`;
        modalExperience.innerHTML = `<strong>Experiencia:</strong> ${card.querySelector('.experiencia span').innerText}`;
        modalEducationLevel.innerHTML = `<strong>Nivel educativo:</strong> ${card.querySelector('.nivel_educativo span').innerText}`;

        mostrarPostulaciones(currentOfferId);

        // Mostrar el modal
        modal.style.display = 'flex';
    };

    // Agregar evento 'click' a cada tarjeta para abrir el modal
    cards.forEach(card => {
        card.addEventListener('click', function () {
            openModal(card);
        });
    });

    document.getElementById('cancel-button').addEventListener('click', function () {
        // Recarga la página
        location.reload();
    });

    editButton.addEventListener('click', function () {

        // Ocultar botones de editar y eliminar
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
        postCount.style.display = 'none';
        infoButton.style.display = 'none';
        modalTitle.style.display = 'none';
        modalDescription.style.display = 'none';
        modalSalary.style.display = 'none';
        modalCurrency.style.display = 'none';
        modalDuration.style.display = 'none';
        modalPeriod.style.display = 'none';
        modalType.style.display = 'none';
        modalModalidad.style.display = 'none';
        modalTypeContract.style.display = 'none';

        // Mostrar el formulario de edición
        editForm.style.display = 'block';

        // Pre-llenar el formulario con los datos actuales 
        editTitle.value = modalTitle.textContent.trim();
        editDescription.value = modalDescription.textContent.trim();
        editSalary.value = modalSalary.textContent.replace('Salario: ', '').trim();
        editCurrency.value = modalCurrency.textContent.replace('Moneda: ', '').trim();
        editDuration.value = modalDuration.textContent.replace('Duración: ', '').trim();
        editPeriod.value = modalPeriod.textContent.replace('Periodo: ', '').trim();
        editModalidad.value = modalModalidad.textContent.replace('Modalidad: ', '').trim();
        editType.value = modalType.textContent.replace('Tipo de empleo: ', '').trim();
        editTypeContract.value = modalTypeContract.textContent.replace('Tipo de contrato: ', '').trim();


    });

    // Guardar los cambios
    saveButton.addEventListener('click', function () {
        const updatedOffer = {
            id: currentOfferId,
            titulo_puesto: editTitle.value,
            descripcion: editDescription.value,
            salario: parseInt(editSalary.value),
            moneda: editCurrency.value,
            duracion: editDuration.value,
            periodo: editPeriod.value,
            modalidad: editModalidad.value,
            tipo_empleo: editType.value,
            tipo_contrato: editTypeContract.value
        };

        fetch(`/offers/edit/${currentOfferId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOffer)
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Oferta actualizada con éxito',
                        text: 'La oferta fue actualizada correctamente.',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        modal.style.display = 'none';
                        location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar la oferta',
                        text: 'Hubo un problema al intentar actualizar la oferta. Inténtalo nuevamente.',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la oferta',
                    text: 'Hubo un error al procesar la solicitud. Inténtalo nuevamente.'
                });
            });
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

function openModal(offer) {
    document.getElementById('modal').setAttribute('data-offer-id', offer.id);
    // Configura otros datos
    document.getElementById('modal-title').textContent = offer.title;
    document.getElementById('modal-description').textContent = offer.description;
    document.getElementById('modal').style.display = 'block';
}

document.getElementById('delete-button').addEventListener('click', function () {
    const offerId = document.getElementById('modal').getAttribute('data-offer-id');
    console.log("ID de la oferta a eliminar: ", offerId);  // Agregar esta línea
    if (!offerId || isNaN(offerId)) {
        alert("Error: ID de oferta no encontrado o inválido.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar esta oferta?")) {
        fetch(`/offers/delete/${offerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert("Oferta eliminada con éxito");
                    document.getElementById('modal').style.display = 'none';
                    location.reload();
                } else {
                    alert("Error al eliminar la oferta");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Error al eliminar la oferta");
            });
    }
});

function mostrarPostulaciones(idOferta) {
    console.log("ID de oferta:", idOferta);  // Verifica el valor de idOferta
    fetch(`/ofertas/${idOferta}/postulaciones/count`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener postulaciones');
            }
            return response.json(); // Convierte la respuesta en JSON
        })
        .then(data => {
            console.log("Respuesta de postulaciones: ", data);
            // Asegurarse de que data es un número
            if (typeof data === 'number') {
                document.getElementById('postulaciones-count').innerText = `${data} personas se han postulado`;
            } else {
                document.getElementById('postulaciones-count').innerText = 'Error al obtener postulaciones';
            }
        })
        .catch(error => {
            console.error('Error al obtener el número de postulaciones:', error);
            document.getElementById('postulaciones-count').innerText = 'Error al obtener postulaciones';
        });
}

// Formatear los salarios al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".salario span").forEach(function (element) {
        let value = element.textContent.trim();
        if (!isNaN(value) && value !== "") {
            element.textContent = Number(value).toLocaleString("es-CO");
        }
    });
});

//codigo que hace que aparezca el salario con comas
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".salario span").forEach(function (element) {
        let value = element.textContent.trim();
        if (!isNaN(value) && value !== "") {
            element.textContent = Number(value).toLocaleString("es-CO");
        }
    });
});

// Código que hace que aparezca la foto de perfil 
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("user-avatar");

    // Intenta cargar la imagen desde el servidor
    fetch("/empresas/photo")
        .then(response => {
            if (!response.ok) {
                // Si no se encuentra la imagen en el servidor, usa la imagen por defecto
                userAvatar.src = "../Imagenes/imagenempresa.png";
            } else {
                return response.blob(); // Convierte la respuesta en un blob (archivo de imagen)
            }
        })
        .then(blob => {
            if (blob) {
                userAvatar.src = URL.createObjectURL(blob); // Muestra la imagen obtenida del backend
            }
        })
        .catch(() => {
            // Si hay un error en la petición, usa la imagen por defecto
            userAvatar.src = "../Imagenes/imagenempresa.png";
        });

    // Evento para actualizar la foto cuando el usuario la cambia
    function actualizarFotoPerfil(nuevaFoto) {
        userAvatar.src = nuevaFoto;
        localStorage.setItem("fotoPerfil", nuevaFoto); // Guardar en localStorage
    }

    // Simulación: si el usuario sube una nueva imagen
    document.getElementById("subirFoto").addEventListener("change", function (event) {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = function (e) {
                actualizarFotoPerfil(e.target.result);
            };
            lector.readAsDataURL(archivo);
        }
    });
});



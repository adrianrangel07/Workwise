
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
        modalSalary.innerHTML = `<strong>Salario:</strong> ${salary}`;
        modalCurrency.innerHTML = `<strong>moneda:</strong> ${currency}`;
        modalDuration.innerHTML = `<strong>Duración:</strong> ${duration}`;
        modalPeriod.innerHTML = `<strong>Periodo:</strong> ${period}`;
        modalType.innerHTML = `<strong>Tipo de empleo:</strong> ${type}`;
        modalModalidad.innerHTML = `<strong>Modalidad:</strong> ${modalidad}`;
        modalTypeContract.innerHTML = `<strong>tipo de contrato:</strong> ${typeContract}`;
        modalEmpresa.innerHTML = `<strong>Empresa:</strong> ${empresa}`;


        const ofertaId = card.getAttribute("data-id"); // Obtener ID de la oferta
        postularseBtn.setAttribute("data-oferta-id", ofertaId); // Asignarlo al botón

        // Verifica si se asignó correctamente
        console.log("ID de la oferta en el botón:", postularseBtn.getAttribute("data-oferta-id"));
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


//boton postularse 
const postularseBtn = document.getElementById('postularseBtn');
postularseBtn.addEventListener("click", function () {
    // Obtener el ID de la oferta desde el botón
    const ofertaId = parseInt(postularseBtn.getAttribute('data-oferta-id'), 10);
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

function cerrarSesion(event) {
    event.preventDefault(); // Evitar que se ejecute el href del enlace

    Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Se cerrará tu sesión.',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin' // Enviar cookies y sesión
            }).then(response => {
                window.location.href = '/login/personas?logout=true'; // Redirigir al login
            });
        }
    });
}


//codigo que hace que aparezca la foto de perfil 
document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del usuario desde el HTML
    const usuarioNombre = document.getElementById("usuario");
    const userAvatar = document.getElementById("user-avatar");

    // Si hay una foto en localStorage, usarla
    if (localStorage.getItem("fotoPerfil")) {
        userAvatar.src = localStorage.getItem("fotoPerfil");
    }

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

//codigo que hace que aparezca el salario con comas
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".salario span").forEach(function (element) {
        let value = element.textContent.trim();
        if (!isNaN(value) && value !== "") {
            element.textContent = Number(value).toLocaleString("es-CO");
        }
    });
});

function cerrarSesionYRedirigir(event) {
    event.preventDefault(); // Evita la navegación inmediata

    Swal.fire({
        title: "Cerrando sesión...",
        text: "Estamos cerrando tu sesión. Por favor, espera.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading(); // Muestra un loader
            
            // Enviar la solicitud de cierre de sesión
            fetch('/logout', { method: 'POST' })
                .then(response => {
                    // Esperamos 2 segundos antes de redirigir, asegurando que la sesión se cierre
                    setTimeout(() => {
                        window.location.href = '/login/Empresa';
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error al cerrar sesión:', error);
                    Swal.fire("Error", "No se pudo cerrar la sesión.", "error");
                });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var loginMeta = document.getElementById("loginSuccess");
    var loginSuccess = loginMeta ? loginMeta.content === "true" : false;

    console.log("loginSuccess:", loginSuccess); // Para ver si se detecta correctamente

    if (loginSuccess) {
        Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido a la plataforma.',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // 🔹 Eliminar la variable de sesión después de mostrar la alerta
            fetch('/eliminarLoginSuccess', { method: 'POST' });
        });
    }
});
//de aqui en adelante la tarjeta
document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll(".offer-content");
    const modal = document.getElementById("modal");
    const closeModalBtn = document.querySelector(".close-btn");

    // Elementos del modal
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalSalary = document.getElementById("modal-salary");
    const modalCurrency = document.getElementById("modal-currency");
    const modalDuration = document.getElementById("modal-duration");
    const modalPeriod = document.getElementById("modal-period");
    const modalType = document.getElementById("modal-type");
    const modalModalidad = document.getElementById("modal-modalidad");
    const modalTypeContract = document.getElementById("modal-typeContract");
    const modalEmpresa = document.getElementById("modal-empresa");
    const modalSector = document.getElementById("modal-sector")
    const modalExperiencia = document.getElementById("modal-experience")
    const modalEstudio = document.getElementById("modal-studyLevel")
    // Función para abrir el modal
    const openModal = (card) => {
        // Obtener los datos de la tarjeta
        const title = card.querySelector("h3").innerText;
        const description = card.querySelector("p").innerText;
        const salary = card.querySelector(".salario span").innerText;
        const currency = card.querySelector(".moneda span").innerText;
        const duration = card.querySelector(".duracion span").innerText;
        const period = card.querySelector(".periodo span").innerText;
        const type = card.querySelector(".tipo_empleo span").innerText;
        const modalidad = card.querySelector(".modalidad span").innerText;
        const typeContract = card.querySelector(".tipo_contrato span").innerText;
        const empresa = card.querySelector(".empresa span").innerText;
        const sector = card.querySelector(".sector span").innerText
        const experience = card.querySelector(".experiencia span").innerText
        const studyLevel = card.querySelector(".nivel_educativo span").innerText

        // Llenar el modal con los datos de la tarjeta
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalSalary.innerHTML = `<strong>Salario: </strong> ${salary}`;
        modalCurrency.innerHTML = `(${currency})`;
        modalDuration.innerHTML = `(${duration})`;
        modalPeriod.innerHTML = `(${period})`;
        modalType.innerHTML = `<strong>Tipo de empleo: </strong> ${type}`;
        modalModalidad.innerHTML = `<strong>Modalidad: </strong> ${modalidad}`;
        modalTypeContract.innerHTML = `<strong>Tipo de contrato: </strong> ${typeContract}`;
        modalEmpresa.innerHTML = `<strong>Empresa: </strong> ${empresa}`;
        modalSector.innerHTML = `<strong>Sector:</strong>${sector}` || "No especificado";
        modalExperiencia.innerHTML = `<strong>Experiencia:</strong>${experience}` || "No especificado";
        modalEstudio.innerHTML = `<strong>Nivel de estudio:</strong>${studyLevel}` || "No especificado";

        const ofertaId = card.getAttribute("data-id"); // Obtener ID de la oferta
        postularseBtn.setAttribute("data-oferta-id", ofertaId); // Asignarlo al botón

        const btnPrediccion = document.getElementById("btn-prediccion");
        btnPrediccion.setAttribute("href", `/prediccion?id=${ofertaId}`);

        // Verifica si se asignó correctamente
        console.log(
            "ID de la oferta en el botón:",
            postularseBtn.getAttribute("data-oferta-id")
        );

        // Mostrar el modal
        modal.style.display = "flex";
    };
    // Agregar evento 'click' a cada tarjeta para abrir el modal
    cards.forEach((card) => {
        card.addEventListener("click", function () {
            openModal(card);
        });
    });

    // Cerrar el modal al hacer clic en el botón de cierre
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

//codigo para filtrador de busqueda por termino
document.addEventListener("DOMContentLoaded", function () {
    const formBusqueda = document.getElementById("formBusqueda");
    const terminoInput = document.getElementById("termino");
    const ofertas = document.querySelectorAll(".offer-container .card");

    function normalizeText(text) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    // Captura el término de búsqueda de la URL
    const params = new URLSearchParams(window.location.search);
    const terminoBuscado = params.get("termino");

    if (terminoBuscado) {
        if (terminoInput) {
            terminoInput.value = terminoBuscado;
        }

        const terminoNormalizado = normalizeText(terminoBuscado);
        let ofertasEncontradas = false;

        ofertas.forEach((oferta) => {
            const titulo = normalizeText(oferta.querySelector("h3").textContent);
            if (titulo.includes(terminoNormalizado)) {
                oferta.style.display = "block";
                ofertasEncontradas = true;
            } else {
                oferta.style.display = "none";
            }
        });

        if (!ofertasEncontradas) {
            Swal.fire({
                icon: "warning",
                title: "No se encontraron ofertas",
                text: "Por favor, verifica el término de búsqueda.",
                confirmButtonText: "Aceptar",
            }).then(() => {
                location.href = "/personas/pagina_principal";
            });
        }
    }

    // BÚSQUEDA MANUAL
    formBusqueda?.addEventListener("submit", function (event) {
        event.preventDefault();
        const termino = normalizeText(terminoInput.value);
        let ofertasEncontradas = false;

        ofertas.forEach((oferta) => {
            const titulo = normalizeText(oferta.querySelector("h3").textContent);
            if (titulo.includes(termino)) {
                oferta.style.display = "block";
                ofertasEncontradas = true;
            } else {
                oferta.style.display = "none";
            }
        });

        if (!ofertasEncontradas) {
            Swal.fire({
                icon: "warning",
                title: "No se encontraron ofertas",
                text: "Por favor, verifica el término de búsqueda.",
                confirmButtonText: "Aceptar",
            }).then(() => {
                location.reload();
            });
        }

        terminoInput.value = "";
    });

    reloadFavorites();
});

function applyFilters() {
    // Cerrar la barra lateral de filtros desmarcando el checkbox
    document.getElementById("btn-menu").checked = false;

    // Capturar valores de los filtros
    const salarioMin =
        parseFloat(document.getElementById("salarioMin").value) || 0;
    const salarioMax =
        parseFloat(document.getElementById("salarioMax").value) || Infinity;
    const tipoEmpleo = document
        .getElementById("tipoEmpleoSelect")
        .value.toLowerCase();
    const tipoContrato = document
        .getElementById("typeContract")
        .value.toLowerCase();

    // Capturar modalidades seleccionadas (versión actualizada para la nueva estructura HTML)
    const checkboxes = document.querySelectorAll(
        '.filter-section-body input[type="checkbox"]'
    );
    const selectedModalities = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value.toLowerCase());

    const ofertas = document.querySelectorAll(".offer-container .card");
    let ofertasVisibles = 0; // Contador de ofertas visibles

    // Aplicar los filtros a cada tarjeta de oferta
    ofertas.forEach((oferta) => {
        const salario =
            parseFloat(oferta.querySelector(".salario span").textContent) || 0;
        const tipoEmpleoOferta = oferta
            .querySelector(".tipo_empleo span")
            .textContent.toLowerCase();
        const modalidadOferta = oferta
            .querySelector(".modalidad span")
            .textContent.toLowerCase();
        const tipoContratoOferta = oferta
            .querySelector(".tipo_contrato span")
            .textContent.toLowerCase();

        // Lógica para mostrar/ocultar la oferta según los filtros
        let isVisible = true;

        // Filtramos según los valores de los filtros
        if (salario < salarioMin || salario > salarioMax) isVisible = false;
        if (tipoEmpleo && tipoEmpleo !== tipoEmpleoOferta) isVisible = false;
        if (
            selectedModalities.length > 0 &&
            !selectedModalities.includes(modalidadOferta)
        )
            isVisible = false;
        if (tipoContrato && tipoContrato !== tipoContratoOferta) isVisible = false;

        // Mostrar u ocultar la oferta
        oferta.style.display = isVisible ? "block" : "none";

        if (isVisible) ofertasVisibles++; // Incrementar si la oferta es visible
    });

    // Mostrar alerta si no se encuentran resultados
    if (ofertasVisibles === 0) {
        Swal.fire({
            icon: "warning",
            title: "No se encontraron resultados",
            text: "Ninguna oferta coincide con los filtros aplicados. Intenta con otros criterios.",
            confirmButtonText: "Aceptar",
        }).then(() => {
            resetFilters(); // Mejor que location.reload() para mantener la experiencia fluida
        });
    }

    reloadFavorites(); // Recargar favoritos después de aplicar filtros
}

function resetFilters() {
    // Restablecer valores de los filtros
    document.getElementById("salarioMin").value = "";
    document.getElementById("salarioMax").value = "";
    document.getElementById("typeContract").value = "";
    document.getElementById("tipoEmpleoSelect").value = "";

    // Desmarcar todas las casillas de modalidad
    document
        .querySelectorAll('.filter-section-body input[type="checkbox"]')
        .forEach((checkbox) => {
            checkbox.checked = false;
        });

    // Volver a aplicar los filtros (mostrar todo)
    applyFilters();
}

// Añadir interactividad a los encabezados de sección (colapsables)
document.querySelectorAll(".filter-section-header").forEach((header) => {
    header.addEventListener("click", function () {
        const body = this.nextElementSibling;
        body.style.display = body.style.display === "none" ? "block" : "none";
        this.classList.toggle("collapsed");
    });
});

// Inicializar todas las secciones como visibles
document.querySelectorAll(".filter-section-body").forEach((body) => {
    body.style.display = "block";
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

    sidebar.classList.toggle("toggled");
});

const postularseBtn = document.getElementById("postularseBtn");
postularseBtn.addEventListener("click", function () {
    const ofertaId = parseInt(postularseBtn.getAttribute("data-oferta-id"), 10);
    const usuarioId = document.getElementById("usuarioId").value;

    if (!ofertaId || !usuarioId) return;

    Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres postularte a esta oferta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, postularme",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/postularse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ofertaId: ofertaId,
                    usuarioId: usuarioId,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Actualizar el estado visual
                        const card = document
                            .querySelector(`.card .offer-content[data-id="${ofertaId}"]`)
                            .closest(".card");
                        if (card) {
                            const appliedIcon = document.createElement("div");
                            appliedIcon.className = "applied-icon";
                            appliedIcon.setAttribute("data-id", ofertaId);
                            appliedIcon.innerHTML =
                                '<i class="fas fa-check-circle"></i><span>Postulado</span>';
                            card.insertBefore(appliedIcon, card.firstChild);
                        }

                        Swal.fire({
                            title: "Postulación exitosa",
                            text: data.message,
                            icon: "success",
                            timer: 3000,
                            showConfirmButton: false,
                        }).then(() => {
                            postularseBtn.textContent = "Postulado";
                        });
                    } else {
                        Swal.fire({
                            title: "Ya estás postulado",
                            text: data.message,
                            icon: "info",
                            timer: 3000,
                            showConfirmButton: false,
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al postularse. Inténtalo de nuevo más tarde.",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                });
        }
    });
});

// Función para actualizar el estado visual de postulación
function updateAppliedStatus(ofertaId, isApplied) {
    const appliedIcons = document.querySelectorAll(
        `.applied-icon[data-id="${ofertaId}"]`
    );
    const cards = document
        .querySelectorAll(`.card .offer-content[data-id="${ofertaId}"]`)
        .closest(".card");

    if (isApplied) {
        // Crear el icono si no existe
        if (appliedIcons.length === 0) {
            const card = document
                .querySelector(`.card .offer-content[data-id="${ofertaId}"]`)
                .closest(".card");
            if (card) {
                const appliedIcon = document.createElement("div");
                appliedIcon.className = "applied-icon";
                appliedIcon.setAttribute("data-id", ofertaId);
                appliedIcon.innerHTML =
                    '<i class="fas fa-check-circle"></i><span>Postulado</span>';
                card.insertBefore(appliedIcon, card.firstChild);
            }
        }

        // Actualizar el botón en el modal
        postularseBtn.textContent = "Postulado";
    }
}

// Función para cargar el estado de postulación al inicio
function loadAppliedStatus() {
    document.querySelectorAll(".applied-icon").forEach((icon) => {
        const ofertaId = icon.getAttribute("data-id");
        updateAppliedStatus(ofertaId, true);
    });
}

// Llamar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    loadAppliedStatus();
    setupFavorites();
});

function cerrarSesion(event) {
    event.preventDefault(); // Evitar que se ejecute el href del enlace

    Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "Se cerrará tu sesión.",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("/logout", {
                method: "POST",
                credentials: "same-origin", // Enviar cookies y sesión
            }).then((response) => {
                window.location.href = "/login/personas?logout=true"; // Redirigir al login
            });
        }
    });
}

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
    document
        .getElementById("subirFoto")
        .addEventListener("change", function (event) {
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
            fetch("/logout", { method: "POST" })
                .then((response) => {
                    // Esperamos 2 segundos antes de redirigir, asegurando que la sesión se cierre
                    setTimeout(() => {
                        window.location.href = "/login/Empresa";
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                    Swal.fire("Error", "No se pudo cerrar la sesión.", "error");
                });
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var loginMeta = document.getElementById("loginSuccess");
    var loginSuccess = loginMeta ? loginMeta.content === "true" : false;

    console.log("loginSuccess:", loginSuccess); // Para ver si se detecta correctamente

    if (loginSuccess) {
        Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Bienvenido a la plataforma.",
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            fetch("/eliminarLoginSuccess", { method: "POST" });
        });
    }
});

// Función para manejar favoritos
function setupFavorites() {
    // Cargar favoritos desde localStorage
    let favorites = JSON.parse(localStorage.getItem("jobFavorites")) || [];

    // Función para actualizar el estado visual de los favoritos
    function updateFavoriteIcons() {
        const favoriteIcons = document.querySelectorAll(".favorite-icon");
        const cards = document.querySelectorAll(".card");

        favoriteIcons.forEach((icon) => {
            const offerId = icon.getAttribute("data-id");
            const card = icon.closest(".card");

            if (favorites.includes(offerId)) {
                icon.classList.add("favorited");
                icon.innerHTML = '<i class="fas fa-heart"></i>';
                card.classList.add("favorited");
            } else {
                icon.classList.remove("favorited");
                icon.innerHTML = '<i class="far fa-heart"></i>';
                card.classList.remove("favorited");
            }
        });
    }

    // Manejar clic en iconos de favoritos
    document.querySelectorAll(".favorite-icon").forEach((icon) => {
        icon.addEventListener("click", function (e) {
            e.stopPropagation(); // Evitar que se abra el modal
            const offerId = this.getAttribute("data-id");

            const index = favorites.indexOf(offerId);
            if (index === -1) {
                favorites.push(offerId);
                Swal.fire({
                    icon: "success",
                    title: "Añadido a favoritos",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                favorites.splice(index, 1);
                Swal.fire({
                    icon: "info",
                    title: "Eliminado de favoritos",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }

            localStorage.setItem("jobFavorites", JSON.stringify(favorites));
            updateFavoriteIcons();
        });
    });

    // Actualizar iconos al cargar la página
    updateFavoriteIcons();

    // Modificar la función openModal para evitar conflictos
    const originalOpenModal = window.openModal;
    window.openModal = function (card) {
        originalOpenModal(card);
        // Solo abrir el modal, sin lógica de favoritos
    };
}

// Llamar a la función cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    setupFavorites();
});

// Función para recargar favoritos después de filtros/búsquedas
function reloadFavorites() {
    setupFavorites();
}

// Toggle sidebar en móviles
document.getElementById("sidebarToggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("show");
});

// Cerrar sidebar al hacer clic fuera en móviles
document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (
        window.innerWidth <= 992 &&
        !sidebar.contains(event.target) &&
        event.target !== sidebarToggle &&
        !sidebarToggle.contains(event.target)
    ) {
        sidebar.classList.remove("show");
    }
});

// Ajustar altura del contenedor de filtros para móviles
function adjustFilterHeight() {
    if (window.innerWidth <= 768) {
        const filterMenu = document.getElementById("cont-menu");
        const viewportHeight = window.innerHeight;
        filterMenu.style.height = `${viewportHeight}px`;
    }
}

window.addEventListener("resize", adjustFilterHeight);
adjustFilterHeight(); // Ejecutar al cargar

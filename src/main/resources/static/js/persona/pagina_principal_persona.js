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

        function convertirExperiencia(experiencia) {
            switch (experiencia) {
                case "0":
                    return "Sin experiencia";
                case "1":
                    return "Menos de 1 año";
                case "2":
                    return "Entre 1 y 3 años";
                case "3":
                    return "Entre 3 y 5 años";
                case "4":
                    return "Entre 5 y 10 años";
                case "5":
                    return "Más de 10 años";
                default:
                    return "No especificado";
            }
        }

        function convertirEducacion(nivelEducativo) {
            switch (nivelEducativo) {
                case "Sin_estudios":
                    return "Sin estudios";
                case "Bachiller":
                    return "Bachiller";
                case "Tecnico_Tecnologo":
                    return "Técnico/Tecnólogo";
                case "Tecnologo_Universitario":
                    return "Tecnólogo o Universitario";
                case "Universitario":
                    return "Universitario";
                case "Master":
                    return "Máster";
                case "Doctorado":
                    return "Doctorado";
                default:
                    return "No especificada";
            }
        }

        function convertirTipoEmpleo(tipoEmpleo) {
            switch (tipoEmpleo) {
                case "Tiempo_Completo":
                    return "Tiempo completo";
                case "Medio_Tiempo":
                    return "Medio tiempo";
                case "Por_Horas":
                    return "Por horas";
                case "Freelance":
                    return "Freelance";
                default:
                    return "No especificado";
            }
        }

        function convertirTipoContrato(tipoContrato) {
            switch (tipoContrato) {
                case "Indefinido":
                    return "Indefinido";
                case "Fijo":
                    return "Fijo";
                case "Obra_labor":
                    return "Obra labor";
                case "Practicas":
                    return "Prácticas";
                default:
                    return "No espeficado";
            }
        }

        // Obtener los datos de la tarjeta
        const title = card.querySelector("h3").innerText;
        const description = card.querySelector("p").innerText;
        const salary = card.querySelector(".salario span").innerText;
        const currency = card.querySelector(".moneda span").innerText;
        const duration = card.querySelector(".duracion span").innerText;
        const period = card.querySelector(".periodo span").innerText;
        const type = convertirTipoEmpleo(card.querySelector(".tipo_empleo span").innerText);
        const modalidad = card.querySelector(".modalidad span").innerText;
        const typeContract = convertirTipoContrato(card.querySelector(".tipo_contrato span").innerText);
        const empresa = card.querySelector(".empresa span").innerText;
        const sector = card.querySelector(".sector span").innerText
        const experience = convertirExperiencia(card.querySelector(".experiencia span").innerText);
        const studyLevel = convertirEducacion(card.querySelector(".nivel_educativo span").innerText);



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

        const postularseBtn = document.getElementById("postularseBtn");
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
    function applyResponsiveClass() {
        const element = document.getElementById('navbar-responsive');

        if (!element) {
            console.log("Elemento no encontrado");
            return;
        }

        if (window.matchMedia('(max-width: 768px)').matches) {
            element.classList.add('toggled');
            console.log("Clase 'toggled' agregada");
        } else {
            element.classList.remove('toggled');
            console.log("Clase 'toggled' removida");
        }
    }

    applyResponsiveClass();
    window.addEventListener('resize', applyResponsiveClass);
});

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

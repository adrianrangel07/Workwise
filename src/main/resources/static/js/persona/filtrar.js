
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
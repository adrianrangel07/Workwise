document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const adminSidebar = document.querySelector(".admin-sidebar");

    if (mobileMenuToggle && adminSidebar) {
        mobileMenuToggle.addEventListener("click", function () {
            adminSidebar.classList.toggle("active");
            this.classList.toggle("active");
        });
    }

    // Logout confirmation
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Estás a punto de cerrar tu sesión como administrador",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                backdrop: "rgba(0,0,0,0.4)",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = e.target.href;
                }
            });
        });
    }

    // Event listeners para botones de información de empresa
    document.addEventListener("click", function (e) {
        // Botón de información de empresa
        if (e.target.closest(".view-empresa-info")) {
            const empresaId = e.target
                .closest("tr")
                .querySelector("td:first-child").textContent;
            obtenerDatosEmpresa(empresaId);
        }

        // Botón de desactivar/activar
        if (e.target.closest(".toggle-status")) {
            const empresaId = e.target
                .closest("tr")
                .querySelector("td:first-child").textContent;
            desactivarEmpresa(empresaId);
        }
    });

    // Verificar si no hay resultados después de una búsqueda
    checkForEmptyResults();

    // Event listeners para el buscador
    document
        .getElementById("searchButton")
        .addEventListener("click", handleSearch);
    document
        .getElementById("searchInput")
        .addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                handleSearch();
            }
        });
});

window.addEventListener("load", function () {
    document.body.classList.add("loaded");
});

// Función para obtener datos de la empresa
function obtenerDatosEmpresa(idEmpresa) {
    showLoadingModal();
    fetch(`/admin/empresas/${idEmpresa}/datos`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener datos de la empresa");
            }
            return response.json();
        })
        .then((data) => {
            setTimeout(() => {
                mostrarInformacionEmpresa(data);
            }, 2000);
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron obtener los datos de la empresa",
                icon: "error",
            });
        });
}

function mostrarInformacionEmpresa(empresa) {
    const modalBody = document.querySelector("#empresaInfoModal .modal-body");

    // Quitar el spinner si existe
    const loadingDiv = document.getElementById("empresaLoadingTemp");
    if (loadingDiv) {
        loadingDiv.remove();
    }

    // Restaurar la visibilidad del contenido original
    [...modalBody.children].forEach((child) => {
        if (child.id !== "empresaLoadingTemp") {
            child.style.display = "";
        }
    });

    // Llenar los campos del modal
    document.getElementById("empresaNombre").textContent = empresa.nombreEmp;
    document.getElementById("empresaEmail").textContent = empresa.email;
    document.getElementById("empresaNit").textContent = empresa.nit;
    document.getElementById("empresaRazonSocial").textContent =
        empresa.razon_social;
    document.getElementById("empresaDireccion").textContent = empresa.direccion;
    document.getElementById("empresaId").textContent = empresa.id;

    // Estado de la empresa
    const statusBadge = document.getElementById("empresaStatus");
    statusBadge.textContent = empresa.activo ? "Activo" : "Inactivo";
    statusBadge.className = empresa.activo
        ? "badge bg-success"
        : "badge bg-danger";

    // Logo de la empresa
    const empresaLogo = document.getElementById("empresaLogo");
    if (empresa.logo) {
        empresaLogo.src = `data:image/jpeg;base64,${empresa.logo}`;
    } else {
        empresaLogo.src = "/Imagenes/default-company.png";
        empresaLogo.alt = "Logo no disponible";
    }

    // Mostrar solo el número de ofertas
    document.getElementById("empresaOfertas").textContent =
        empresa.numOfertas || 0;

    // Mostrar el modal
    const empresaInfoModal = new bootstrap.Modal(
        document.getElementById("empresaInfoModal")
    );
    empresaInfoModal.show();
}

function desactivarEmpresa(idEmpresa) {
    Swal.fire({
        title: "¿Cambiar estado de la empresa?",
        text: "Estás a punto de cambiar el estado de esta empresa",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        backdrop: "rgba(0,0,0,0.4)",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/empresas/${idEmpresa}/desactivar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    return response.json();
                })
                .then((data) => {
                    Swal.fire({
                        title: "¡Éxito!",
                        text: "Estado de la empresa actualizado correctamente",
                        icon: "success",
                    }).then(() => {
                        location.reload();
                    });
                })
                .catch((error) => {
                    console.error("Error:", error);
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo actualizar el estado de la empresa",
                        icon: "error",
                    });
                });
        }
    });
}

// Función para verificar si no hay resultados
function checkForEmptyResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");

    if (searchQuery) {
        // Esperar un breve momento para que la tabla se renderice completamente
        setTimeout(() => {
            const tableBody = document.querySelector("#empresasTable tbody");
            const visibleRows = tableBody.querySelectorAll(
                'tr:not([style*="display: none"])'
            );

            if (visibleRows.length === 0) {
                showNoResultsAlert(searchQuery);
            }
        }, 300);
    }
}

// Función para mostrar alerta de no resultados
function showNoResultsAlert(searchQuery) {
    Swal.fire({
        title: "No se encontraron resultados",
        html: `No existe ninguna empresa que coincida con: <strong>${searchQuery}</strong>`,
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
        backdrop: "rgba(0,0,0,0.4)",
    }).then(() => {
        // Vaciar el campo de búsqueda y recargar la página
        document.getElementById("searchInput").value = "";
        window.location.href = "/admin/empresas";
    });
}

// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length === 0) {
        Swal.fire({
            title: "Campo vacío",
            text: "Por favor ingresa un término de búsqueda",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3085d6",
        }).then(() => {
            document.getElementById("searchInput").value = "";
        });
    }

    // Mostrar estado de carga
    const originalContent = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
    searchButton.disabled = true;

    // Realizar la búsqueda
    window.location.href = `/admin/empresas/buscar?query=${encodeURIComponent(
        searchTerm
    )}`;

    // Restaurar el botón después de 3 segundos (como fallback)
    setTimeout(() => {
        searchButton.innerHTML = originalContent;
        searchButton.disabled = false;
    }, 3000);
}

function showLoadingModal() {
    const modalBody = document.querySelector("#empresaInfoModal .modal-body");

    if (modalBody) {
        // Oculta el contenido actual del modal (pero no lo borra)
        [...modalBody.children].forEach((child) => {
            child.style.display = "none";
        });

        // Crea el spinner dinámicamente
        const loadingDiv = document.createElement("div");
        loadingDiv.id = "empresaLoadingTemp";
        loadingDiv.className = "text-center py-4";
        loadingDiv.innerHTML = `
            <div class="spinner-border text-primary" role="status" aria-live="polite" aria-busy="true">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando información de la empresa...</p>
        `;

        modalBody.appendChild(loadingDiv);

        const modalElement = document.getElementById("empresaInfoModal");
        if (!bootstrap.Modal.getInstance(modalElement)) {
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.show();
        } else {
            bootstrap.Modal.getInstance(modalElement).show();
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

document.getElementById("empresaInfoModal").addEventListener("hidden.bs.modal", function () {
    // Elimina el spinner si quedó
    const loadingDiv = document.getElementById("empresaLoadingTemp");
    if (loadingDiv) {
        loadingDiv.remove();
    }

    // Restaura la visibilidad por si quedó oculta
    const modalBody = this.querySelector(".modal-body");
    if (modalBody) {
        [...modalBody.children].forEach(child => {
            child.style.display = "";
        });
    }

    // Limpieza de backdrop (por si queda pegado)
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
        backdrop.remove();
    }

    // Quita la clase que deshabilita el scroll del body
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = "";
});

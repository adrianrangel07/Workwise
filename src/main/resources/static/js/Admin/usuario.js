document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');

    if (mobileMenuToggle && adminSidebar) {
        mobileMenuToggle.addEventListener('click', function () {
            adminSidebar.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Logout confirmation
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Cerrar sesión?',
                text: "Estás a punto de cerrar tu sesión como administrador",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
                backdrop: 'rgba(0,0,0,0.4)'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = e.target.href;
                }
            });
        });
    }

    // Event listeners para botones de información de usuario
    document.addEventListener('click', function (e) {
        // Botón de información de usuario
        if (e.target.closest('.view-user-info')) {
            const userId = e.target.closest('tr').querySelector('td:first-child').textContent;
            obtenerDatosUsuario(userId);
        }

        // Botón de desactivar/activar
        if (e.target.closest('.toggle-status')) {
            const userId = e.target.closest('tr').querySelector('td:first-child').textContent;
            desactivarUsuario(userId);
        }
    });

    // Configura el buscador en tiempo real
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleRealTimeSearch, 300));

    // Verificar si no hay resultados después de una búsqueda
    checkForEmptyResults();
});

window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Función para obtener datos del usuario
function obtenerDatosUsuario(idUsuario) {
    showLoadingModal();
    fetch(`/admin/usuarios/${idUsuario}/datos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }
            return response.json();
        })
        .then(data => {
            setTimeout(() => {
                mostrarInformacionUsuario(data);
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron obtener los datos del usuario',
                icon: 'error'
            });
        });
}

function mostrarInformacionUsuario(usuario) {
    const modalBody = document.querySelector('#userInfoModal .modal-body');

    // Quitar el spinner si existe
    const loadingDiv = document.getElementById('userLoadingTemp');
    if (loadingDiv) {
        loadingDiv.remove();
    }

    // Restaurar la visibilidad del contenido original
    [...modalBody.children].forEach((child) => {
        if (child.id !== 'userLoadingTemp') {
            child.style.display = "";
        }
    });

    // Formatear la fecha de nacimiento
    const fechaNacimiento = new Date(usuario.fecha_nacimiento);
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaNacimiento.toLocaleDateString('es-ES', opcionesFecha);

    // Llenar los campos del modal
    document.getElementById('userFullName').textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById('userEmail').textContent = usuario.email;
    document.getElementById('userIdentificacion').textContent = usuario.identificacion;
    document.getElementById('userTipoIdentificacion').textContent = usuario.tipoIdentificacion;
    document.getElementById('userFechaNacimiento').textContent = fechaFormateada;
    document.getElementById('userGenero').textContent = usuario.genero;
    document.getElementById('userId').textContent = usuario.id;

    // Estado del usuario
    const statusBadge = document.getElementById('userStatus');
    statusBadge.textContent = usuario.activo ? 'Activo' : 'Inactivo';
    statusBadge.className = usuario.activo ? 'badge bg-success' : 'badge bg-danger';

    // Foto de perfil
    const userPhoto = document.getElementById('userPhoto');
    if (usuario.foto) {
        userPhoto.src = `data:image/jpeg;base64,${usuario.foto}`;
    } else {
        userPhoto.src = '/Imagenes/default-user.png';
        userPhoto.alt = 'Foto no disponible';
    }

    // Configurar botones para el CV
    const viewCvBtn = document.getElementById('viewCvBtn');
    const downloadCvBtn = document.getElementById('downloadCvBtn');

    if (usuario.cv) {
        const cvBlob = base64ToBlob(usuario.cv, 'application/pdf');
        const cvUrl = URL.createObjectURL(cvBlob);

        viewCvBtn.onclick = () => window.open(cvUrl, '_blank');
        downloadCvBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = cvUrl;
            a.download = `CV_${usuario.nombre}_${usuario.apellido}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        viewCvBtn.disabled = false;
        downloadCvBtn.disabled = false;
        viewCvBtn.classList.remove('disabled');
        downloadCvBtn.classList.remove('disabled');
    } else {
        viewCvBtn.disabled = true;
        downloadCvBtn.disabled = true;
        viewCvBtn.classList.add('disabled');
        downloadCvBtn.classList.add('disabled');
    }

    // Mostrar número de postulaciones
    const postulacionesElement = document.getElementById('userPostulaciones');
    postulacionesElement.textContent = usuario.numPostulaciones || 0;
    
    // Crear una lista de postulaciones
    if (usuario.postulaciones && usuario.postulaciones.length > 0) {
        const postulacionesList = document.createElement('ul');
        postulacionesList.className = 'postulaciones-list';

        usuario.postulaciones.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${post.ofertaTitulo || 'Oferta sin título'}</strong>
                <span class="badge ${getEstadoBadgeClass(post.estado)}">${post.estado}</span>
            `;
            postulacionesList.appendChild(li);
        });

        document.getElementById('userPostulaciones').appendChild(postulacionesList);
    }

    // Mostrar el modal
    const userInfoModal = new bootstrap.Modal(document.getElementById('userInfoModal'));
    userInfoModal.show();
}

// Función para convertir Base64 a Blob
function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

function desactivarUsuario(idUsuario) {
    Swal.fire({
        title: '¿Cambiar estado del usuario?',
        text: "Estás a punto de cambiar el estado de este usuario",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        backdrop: 'rgba(0,0,0,0.4)'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/usuarios/${idUsuario}/desactivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Estado del usuario actualizado correctamente',
                        icon: 'success'
                    }).then(() => {
                        location.reload();
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo actualizar el estado del usuario',
                        icon: 'error'
                    });
                });
        }
    });
}

// Función para verificar si no hay resultados
function checkForEmptyResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');

    if (searchQuery) {
        // Esperar un breve momento para que la tabla se renderice completamente
        setTimeout(() => {
            const tableBody = document.querySelector('#usersTable tbody');
            const visibleRows = tableBody.querySelectorAll('tr:not([style*="display: none"])');

            if (visibleRows.length === 0) {
                showNoResultsAlert(searchQuery);
            }
        }, 300);
    }
}

// Función para mostrar alerta de no resultados
function showNoResultsAlert(searchQuery) {
    Swal.fire({
        title: 'No se encontraron resultados',
        html: `No existe ninguna persona que coincida con: <strong>${searchQuery}</strong>`,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido',
        backdrop: 'rgba(0,0,0,0.4)'
    }).then(() => {
        // Vaciar el campo de búsqueda y recargar la página
        document.getElementById('searchInput').value = '';
        window.location.href = '/admin/usuarios';
    });
}

// Función para manejar la búsqueda en tiempo real
function handleRealTimeSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const searchButton = document.getElementById('searchButton');
    
    if (searchTerm.length === 0) {
        // Si el campo está vacío, recarga la página sin parámetros de búsqueda
        window.location.href = '/admin/usuarios';
        return;
    }
    
    // Mostrar estado de carga
    const originalContent = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
    searchButton.disabled = true;
    
    // Realiza la búsqueda sin recargar la página completa
    fetch(`/admin/usuarios/buscar?query=${encodeURIComponent(searchTerm)}&page=0&size=10`, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta");
            }
            return response.text();
        })
        .then(html => {
            // Parsear el HTML y extraer solo la tabla
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newTable = doc.querySelector("#usersTable");
            const newPagination = doc.querySelector(".pagination");
            
            if (newTable) {
                // Reemplazar solo la tabla y la paginación
                const currentTable = document.querySelector("#usersTable");
                const currentPagination = document.querySelector(".pagination");
                
                if (currentTable && newTable) {
                    currentTable.innerHTML = newTable.innerHTML;
                }
                
                if (currentPagination && newPagination) {
                    currentPagination.innerHTML = newPagination.innerHTML;
                }
                
                // Actualizar la información de paginación
                const pageInfo = doc.querySelector("#usersTable_info");
                if (pageInfo) {
                    document.querySelector("#usersTable_info").innerHTML = pageInfo.innerHTML;
                }
            }
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al realizar la búsqueda",
                icon: "error",
            });
        })
        .finally(() => {
            // Restaurar el botón de búsqueda
            searchButton.innerHTML = originalContent;
            searchButton.disabled = false;
        });
}

function showLoadingModal() {
    const modalBody = document.querySelector("#userInfoModal .modal-body");

    if (modalBody) {
        // Oculta el contenido actual del modal (pero no lo borra)
        [...modalBody.children].forEach((child) => {
            child.style.display = "none";
        });

        // Crea el spinner dinámicamente
        const loadingDiv = document.createElement("div");
        loadingDiv.id = "userLoadingTemp";
        loadingDiv.className = "text-center py-4";
        loadingDiv.innerHTML = `
            <div class="spinner-border text-primary" role="status" aria-live="polite" aria-busy="true">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando información del usuario...</p>
        `;

        modalBody.appendChild(loadingDiv);

        const modalElement = document.getElementById("userInfoModal");
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
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Función auxiliar para clases de badge según estado
function getEstadoBadgeClass(estado) {
    switch (estado.toLowerCase()) {
        case 'activo': return 'bg-primary';
        case 'aceptado': return 'bg-success';
        case 'rechazado': return 'bg-danger';
        case 'en proceso': return 'bg-warning';
        default: return 'bg-secondary';
    }
}

document.getElementById("userInfoModal").addEventListener("hidden.bs.modal", function () {
    // Elimina el spinner si quedó
    const loadingDiv = document.getElementById("userLoadingTemp");
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
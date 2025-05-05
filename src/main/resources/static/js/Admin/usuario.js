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
        if (e.target.closest('.btn-info-user')) {
            const userId = e.target.closest('tr').querySelector('td:first-child').textContent;
            obtenerDatosUsuario(userId);
        }

        // Botón de desactivar/activar
        if (e.target.closest('.toggle-status')) {
            const userId = e.target.closest('tr').querySelector('td:first-child').textContent;
            desactivarUsuario(userId);
        }
    });

    // Verificar si no hay resultados después de una búsqueda
    checkForEmptyResults();

    // Event listeners para el buscador
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Función para obtener datos del usuario
function obtenerDatosUsuario(idUsuario) {
    fetch(`/admin/usuarios/${idUsuario}/datos`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }
            return response.json();
        })
        .then(data => {
            mostrarInformacionUsuario(data);
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
        userPhoto.src = '/Imagenes/default-user.png'; // Imagen por defecto
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

// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length === 0) {
        Swal.fire({
            title: 'Campo vacío',
            text: 'Por favor ingresa un término de búsqueda',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#3085d6'
        }).then(() => {
            document.getElementById('searchInput').value = '';
        });
    }

    // Mostrar estado de carga
    const originalContent = searchButton.innerHTML;
    searchButton.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
    searchButton.disabled = true;

    // Realizar la búsqueda
    window.location.href = `/admin/usuarios/buscar?query=${encodeURIComponent(searchTerm)}`;

    // Restaurar el botón después de 3 segundos (como fallback)
    setTimeout(() => {
        searchButton.innerHTML = originalContent;
        searchButton.disabled = false;
    }, 3000);
}
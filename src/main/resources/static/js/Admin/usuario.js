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

    // Verificar si no hay resultados después de una búsqueda
    checkForEmptyResults();
});

window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

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

// Event listeners para el buscador
document.getElementById('searchButton').addEventListener('click', handleSearch);
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
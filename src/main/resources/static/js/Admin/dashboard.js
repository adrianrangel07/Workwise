document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Confirmación para acciones importantes
    document.querySelectorAll('.admin-action').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('¿Estás seguro de realizar esta acción?')) {
                e.preventDefault();
            }
        });
    });

    // Mostrar notificación si viene de logout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('adminLogout')) {
        Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión como administrador correctamente.',
            timer: 3000,
            showConfirmButton: false
        });
    }

    // Gráficos (si decides implementar Chart.js)
    if (typeof Chart !== 'undefined') {
        initCharts();
    }

    // Función para inicializar gráficos
    function initCharts() {
        // Ejemplo de gráfico de usuarios registrados por mes
        const ctx = document.getElementById('usersChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Usuarios registrados',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {
    // Función para aplicar estilos a los estados
    function aplicarEstilosEstado() {
        let estadosElementos = document.querySelectorAll(".estado");

        estadosElementos.forEach(estadoElemento => {
            const estadoTexto = estadoElemento.querySelector("span:nth-child(2)").innerText.trim().toLowerCase();

            // Limpiar clases previas
            estadoElemento.className = 'estado';
            estadoElemento.classList.add(estadoTexto);

            // Estilos del estado (color de fondo del estado en sí)
            switch (estadoTexto) {
                case 'pendiente':
                    estadoElemento.style.backgroundColor = '#FFC107';
                    estadoElemento.style.color = '#000';
                    break;
                case 'aceptado':
                    estadoElemento.style.backgroundColor = '#28A745';
                    estadoElemento.style.color = '#FFF';
                    break;
                case 'rechazado':
                    estadoElemento.style.backgroundColor = '#DC3545';
                    estadoElemento.style.color = '#FFF';
                    break;
                default:
                    estadoElemento.style.backgroundColor = '#6C757D';
                    estadoElemento.style.color = '#FFF';
            }

            const card = estadoElemento.closest(".card");
            if (card) {
                card.style.borderWidth = "2px";
                switch (estadoTexto) {
                    case 'pendiente':
                        card.style.borderColor = '#FFC107';
                        break;
                    case 'aceptado':
                        card.style.borderColor = '#28A745';
                        break;
                    case 'rechazado':
                        card.style.borderColor = '#DC3545';
                        break;
                    default:
                        card.style.borderColor = '#6C757D';
                }
            }
        });
    }

    // Función para mover postulaciones resueltas
    function moverPostulacionesResueltas() {
        const pendingContainer = document.querySelector('.offer-container');
        const resolvedContainer = document.getElementById('resolved-applications-container');
        const noResolvedMessage = resolvedContainer.querySelector('.no-resolved');

        // Verificar si hay postulaciones pendientes
        if (pendingContainer) {
            const pendingCards = Array.from(pendingContainer.querySelectorAll('.card'));
            let resolvedCount = resolvedContainer.querySelectorAll('.card').length;

            pendingCards.forEach(card => {
                const estadoElemento = card.querySelector('.estado');
                if (estadoElemento) {
                    const estadoTexto = estadoElemento.querySelector('span:nth-child(2)').innerText.trim().toLowerCase();

                    if (estadoTexto === 'aceptado' || estadoTexto === 'rechazado') {
                        // Clonar la tarjeta
                        const clonedCard = card.cloneNode(true);

                        // Modificar el botón
                        const button = clonedCard.querySelector('.btn-danger');
                        if (button) {
                            button.textContent = estadoTexto === 'aceptado'
                                ? '¡Fuiste seleccionado!'
                                : 'No fuiste seleccionado';
                            button.className = estadoTexto === 'aceptado'
                                ? 'btn btn-success'
                                : 'btn btn-warning';
                            button.onclick = null;
                            button.style.cursor = 'default';
                        }

                        // Mover a resueltas
                        resolvedContainer.insertBefore(clonedCard, noResolvedMessage);
                        resolvedCount++;

                        // Eliminar de pendientes
                        card.remove();
                    }
                }
            });

            // Ocultar mensaje si hay resueltas
            noResolvedMessage.style.display = resolvedCount > 0 ? 'none' : 'block';
        }
    }

    // Función para verificar cambios en los estados
    function verificarCambiosDeEstado() {
        // Primera ejecución al cargar
        aplicarEstilosEstado();
        moverPostulacionesResueltas();

        // Configurar observador para cambios futuros
        const observer = new MutationObserver(function (mutations) {
            let necesitaActualizar = false;

            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' ||
                    (mutation.type === 'characterData' && mutation.target.classList.contains('estado-texto'))) {
                    necesitaActualizar = true;
                }
            });

            if (necesitaActualizar) {
                aplicarEstilosEstado();
                moverPostulacionesResueltas();
            }
        });

        // Configurar qué observar
        const config = {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false
        };

        // Observar el contenedor de postulaciones
        const targetNode = document.querySelector('.offer-container');
        if (targetNode) {
            observer.observe(targetNode, config);
        }
    }

    // Iniciar la observación de cambios
    verificarCambiosDeEstado();

    // Función para eliminar postulación
    window.eliminarPostulacion = function (button) {
        var postulacionId = button.getAttribute('data-id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/postulacion/eliminar/${postulacionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            button.closest('.card').remove();
                            Swal.fire({
                                icon: 'success',
                                title: '¡Eliminado!',
                                text: 'Tu postulación ha sido eliminada exitosamente.',
                                showConfirmButton: true,
                                confirmButtonText: 'Ok'
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Hubo un problema al eliminar la postulación.',
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al realizar la solicitud.',
                        });
                    });
            }
        });
    };
});
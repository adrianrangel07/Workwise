document.addEventListener("DOMContentLoaded", function () {
    const eventSource = new EventSource("/notificaciones");

    eventSource.onmessage = function (event) {
        mostrarNotificacion(event.data);
    };

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement("div");
        notificacion.classList.add("notificacion");
        notificacion.innerText = mensaje;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 5000);
    }
});

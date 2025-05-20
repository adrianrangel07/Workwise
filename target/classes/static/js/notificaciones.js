document.addEventListener("DOMContentLoaded", function() {
    if (!window.EventSource) {
        console.error("Tu navegador no soporta Server-Sent Events");
        return;
    }

    const eventSource = new EventSource('/notificaciones');
    
    eventSource.addEventListener('notificacion', function(event) {
        try {
            const data = JSON.parse(event.data);
            mostrarNotificacion(data.mensaje, data.tipo || 'exito');
        } catch (e) {
            console.error('Error al procesar notificación:', e);
        }
    });

    eventSource.onerror = function(e) {
        console.error('Error en conexión SSE:', e);
        eventSource.close();
        setTimeout(() => window.location.reload(), 5000);
    };

    function mostrarNotificacion(mensaje, tipo = 'exito') {

        playNotificationSound();
        
        // Crear elementos
        const notificacion = document.createElement('div');
        const icono = document.createElement('div');
        const contenido = document.createElement('div');
        const cerrar = document.createElement('span');
        
        // Configurar elementos
        notificacion.className = `notificacion ${tipo}`;
        icono.className = 'notificacion-icono';
        contenido.className = 'notificacion-contenido';
        cerrar.className = 'notificacion-cerrar';
        
        // Contenido
        icono.innerHTML = tipo === 'error' ? '⚠️' : 
                         tipo === 'info' ? 'ℹ️' :
                         tipo === 'advertencia' ? '⚠️' : '✅';
        
        contenido.textContent = mensaje;
        cerrar.innerHTML = '&times;';
        
        // Eventos
        cerrar.onclick = () => ocultarNotificacion(notificacion);
        
        // Ensamblar
        notificacion.appendChild(icono);
        notificacion.appendChild(contenido);
        notificacion.appendChild(cerrar);
        
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);
        
        // Ocultar después de 8 segundos
        setTimeout(() => {
            ocultarNotificacion(notificacion);
        }, 8000);
    }
    
    function ocultarNotificacion(notificacion) {
        notificacion.classList.remove('mostrar');
        notificacion.classList.add('ocultar');
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 500);
    }
    function playNotificationSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 880; // Frecuencia en Hz (tono agudo)
            gainNode.gain.value = 0.3; // Volumen (30%)
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 200); // Duración 200ms
        } catch (e) {
            console.log("Error al reproducir sonido:", e);
        }
    }
});
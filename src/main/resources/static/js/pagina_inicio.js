document.getElementById('formBusqueda').addEventListener('submit', function (e) {
    e.preventDefault();
    const termino = document.getElementById('termino').value.trim();
    if (termino !== '') {
        // Redirige a la página principal con el término de búsqueda
        window.location.href = `/pagina/inicio?termino=${encodeURIComponent(termino)}`;
    }
});
// Contador animado
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const el = document.querySelector(element);
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            el.textContent = `+${Math.floor(start)}+`;
            requestAnimationFrame(updateCounter);
        } else {
            el.textContent = `+${target}+`;
        }
    };
    updateCounter();
}

// Lanzar contador cuando se vea la sección
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounter('.stats span:first-child', 5000, 2000);
    }
}, { threshold: 0.5 });

observer.observe(document.querySelector('.stats'));


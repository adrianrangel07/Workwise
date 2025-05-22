function applyResponsiveClass() {
    const element = document.getElementById('navbar-responsive');

    if (!element) {
        console.log("Elemento no encontrado");
        return;
    }

    if (window.matchMedia('(max-width: 768px)').matches) {
        element.classList.add('toggled');
        console.log("Clase 'toggled' agregada");
    } else {
        element.classList.remove('toggled');
        console.log("Clase 'toggled' removida");
    }
}

applyResponsiveClass();
window.addEventListener('resize', applyResponsiveClass);
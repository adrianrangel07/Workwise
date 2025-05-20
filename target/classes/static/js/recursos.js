

// Cierra el sidebar al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (!sidebar.contains(event.target) && event.target !== sidebarToggle) {
        sidebar.classList.remove('active');
        document.getElementById('main-content').classList.remove('shifted');
    }
});

function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Cargar PDF con PDF.js
function loadPDF(url, viewerId = 'pdf-viewer') {
    const viewer = document.getElementById(viewerId);
    viewer.innerHTML = '<p>Cargando PDF...</p>';

    // Usa un proxy CORS
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    
    pdfjsLib.getDocument(proxyUrl).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            viewer.innerHTML = '';
            const canvas = document.createElement('canvas');
            viewer.appendChild(canvas);
            
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            page.render({
                canvasContext: canvas.getContext('2d'),
                viewport
            });
        });
    }).catch(err => {
        viewer.innerHTML = `
            <p style="color: red;">
                Error al cargar el PDF. 
                <a href="${url}" target="_blank" style="color: blue;">Ábrelo en nueva pestaña</a>
            </p>`;
    });
}

// Abrir modal con el video seleccionado
function openModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = videoUrl + "?autoplay=1"; // Autoplay al abrir
    modal.style.display = "block";
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = ""; // Detener el video
    modal.style.display = "none";
}

// Cerrar al hacer clic fuera del modal
window.onclick = function(event) {
    const modal = document.getElementById('video-modal');
    if (event.target === modal) {
        closeModal();
    }
};

 // Función para alternar el sidebar en móviles
 document.getElementById('ocultarNavBar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('d-none');
});

// Funciones existentes para las pestañas y modal
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function openModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = videoUrl + "?autoplay=1";
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = "";
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('video-modal');
    if (event.target === modal) {
        closeModal();
    }
};
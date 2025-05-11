document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const adminSidebar = document.querySelector(".admin-sidebar");

    if (mobileMenuToggle && adminSidebar) {
        mobileMenuToggle.addEventListener("click", function () {
            adminSidebar.classList.toggle("active");
            this.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });
    }

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll(".admin-nav a").forEach((link) => {
        link.addEventListener("click", function () {
            if (window.innerWidth < 992) {
                adminSidebar.classList.remove("active");
                mobileMenuToggle.classList.remove("active");
                document.body.classList.remove("menu-open");
            }
        });
    });

    // Logout confirmation
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            Swal.fire({
                title: "¿Cerrar sesión?",
                text: "Estás a punto de cerrar tu sesión como administrador",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                backdrop: "rgba(0,0,0,0.4)",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = e.target.href;
                }
            });
        });
    }

    // Active nav link highlight
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".admin-nav a");

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
            link.parentElement.classList.add("active");
        }
    });

    // Add animation to cards on load
    const cards = document.querySelectorAll(".admin-card");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);
    });

    // Show logout success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("logoutSuccess")) {
        Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente.",
            timer: 3000,
            showConfirmButton: false,
            backdrop: "rgba(0,0,0,0.4)",
        }).then(() => {
            window.location.href = "/login/personas";
        });
    }

    // Resize observer for sidebar
    const resizeObserver = new ResizeObserver((entries) => {
        if (window.innerWidth <= 576) {
            mobileMenuToggle.style.display = "flex";
        } else {
            mobileMenuToggle.style.display = "none";
            adminSidebar.classList.remove("active");
        }
    });

    resizeObserver.observe(document.body);
});



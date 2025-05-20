// Mostrar el menú al hacer clic en el ícono o bandera
const languageDisplay = document.getElementById("language-display");
if (languageDisplay) {
    languageDisplay.addEventListener("click", function () {
        const options = document.getElementById("language-options");
        options.style.display = options.style.display === "none" ? "block" : "none";
    });
}

// Función al seleccionar un idioma
function selectLanguage(lang) {
    const display = document.getElementById("language-display");
    const options = document.getElementById("language-options");
    let label = "";
    let flag = "";

    if (lang === "es") {
        label = "ES";
        flag = "https://flagcdn.com/w20/es.png";
    } else if (lang === "en") {
        label = "ENG";
        flag = "https://flagcdn.com/w20/us.png";
    }

    // Reemplazar ícono con bandera y texto
    if (display) {
        display.innerHTML = `
            <img src="${flag}" alt="${label}" class="me-2">
            <span class="fw-bold">${label}</span>
        `;
    }

    if (options) {
        options.style.display = "none";
    }

    localStorage.setItem("selectedLanguage", lang);

    // Cargar traducciones y actualizar el contenido de la página
    loadTranslations(lang);
}

// Cargar idioma guardado
window.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
        loadTranslations(savedLang); // Si hay un idioma guardado, cargar las traducciones
    } else {
        // Si no hay idioma guardado, seleccionar el predeterminado
        loadTranslations("es");
    }
});

// Función para cargar las traducciones desde el archivo JSON y actualizar el contenido de la página
function loadTranslations(lang) {
    const pathArray = window.location.pathname.split("/").filter(Boolean);

    let apiUrl = "";

    console.log(pathArray); // Verifica cómo se divide la URL

    if (pathArray[0] === "pagina" && pathArray[1] === "inicio") {
        apiUrl = `/api/traducciones/inicio/${lang}`;
    } else if (pathArray.length >= 2) {
        const pagina = `${pathArray[0]}/${pathArray[1]}`;
        apiUrl = `/api/traducciones/${pagina}/${lang}`;
    } else if (pathArray.length === 1) {
        apiUrl = `/api/traducciones/${pathArray[0]}/${lang}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Archivo no encontrado");
            return response.json();
        })
        .then(translations => {
            updatePageContent(translations);
        })
        .catch(error => console.error('Error al cargar las traducciones desde el backend:', error));
}

// Función para actualizar el contenido de la página con las traducciones
function updatePageContent(translations) {
    const elements = document.querySelectorAll('[data-trad]');
    elements.forEach(el => {
        const key = el.getAttribute('data-trad');
        const translation = translations[key];
        if (translation) {
            // Si es un input, textarea o tiene placeholder
            if (el.placeholder !== undefined) {
                el.placeholder = translation;
            }
            // Si es un botón, podrías usar value (opcional)
            else if (el.value !== undefined && el.tagName === "INPUT") {
                el.value = translation;
            }
            // En cualquier otro caso, usa textContent
            else {
                el.textContent = translation;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Listas predefinidas
    const ocupaciones = ["Arquitecto", "Ingeniero", "Doctor", "Abogado", "Diseñador", "Programador", "Profesor", "Administrador", "Contador"];
    const idiomas = ["Inglés", "Español", "Francés", "Alemán", "Italiano", "Portugués", "Chino", "Japonés", "Ruso"];
    const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];

    function llenarSelect(select, opciones) {
        opciones.forEach(opcion => {
            let option = document.createElement("option");
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        });
    }

    document.querySelectorAll('select[name="cargo[]"]').forEach(select => llenarSelect(select, ocupaciones));
    document.querySelectorAll('select[name="idioma[]"]').forEach(select => llenarSelect(select, idiomas));
    document.querySelectorAll('select[name="nivel[]"]').forEach(select => llenarSelect(select, niveles));

    let contadorExperiencias = 2; // Empezamos en 2 porque la primera ya existe

    function agregarExperiencia() {
        const div = document.createElement("div");
        div.classList.add("experiencia", "mb-3", "p-3", "border", "rounded", "shadow-sm");

        div.innerHTML = `
            <div class="form-floating mb-3">
                <input type="text" name="nombre_de_empresa[]" class="form-control" required placeholder=" ">
                <label>Nombre de la Empresa</label>
            </div>
            <div class="form-floating mb-3">
                <select name="cargo[]" class="form-control" required>
                    <option value="" disabled selected>Seleccione un cargo</option>
                </select>
                <label>Cargo</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" name="fecha_inicio_laboral[]" class="form-control" required placeholder=" ">
                <label>Fecha Inicio</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" name="fecha_fin_laboral[]" class="form-control" required placeholder=" ">
                <label>Fecha Fin</label>
            </div>
            <button type="button" class="btn btn-danger btn-sm btn-eliminar-experiencia">✖</button>
        `;

        document.getElementById("experiencias").appendChild(div);
        llenarSelect(div.querySelector("select[name='cargo[]']"), ocupaciones);

        contadorExperiencias++;
    }

    function actualizarTitulos() {
    const experiencias = document.querySelectorAll("#experiencias .experiencia");
    experiencias.forEach((div, index) => {
        div.querySelector("h4").textContent = `Experiencia Laboral ${index + 2}`;
    });

    // Asegurar que el contador siempre esté sincronizado con la cantidad de experiencias
    contadorExperiencias = experiencias.length + 2;
}
    document.getElementById("btnAgregarExperiencia")?.addEventListener("click", agregarExperiencia);

    function agregarIdioma() {
        const div = document.createElement("div");
        div.classList.add("idioma-entry", "mb-3", "p-3", "border", "rounded", "shadow-sm");

        div.innerHTML = `
            <div class="form-floating mb-3">
                <select class="form-control" name="idioma[]" required>
                    <option value="" disabled selected>Seleccione un idioma</option>
                </select>
                <label>Idioma</label>
            </div>
            <div class="form-floating mb-3">
                <select class="form-control" name="nivel[]" required>
                    <option value="" disabled selected>Seleccione un nivel</option>
                </select>
                <label>Nivel</label>
            </div>
            <button type="button" class="btn btn-danger btn-sm btn-eliminar-idioma">✖</button>
        `;

        document.getElementById("idiomas-container").appendChild(div);
        llenarSelect(div.querySelector("select[name='idioma[]']"), idiomas);
        llenarSelect(div.querySelector("select[name='nivel[]']"), niveles);
    }

    document.getElementById("btnAgregarIdioma")?.addEventListener("click", agregarIdioma);

    // Delegación de eventos para eliminar experiencias laborales
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-eliminar-experiencia")) {
            event.target.closest(".experiencia").remove();
            actualizarTitulos();
        }
    });

    // Delegación de eventos para eliminar idiomas
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn-eliminar-idioma")) {
            event.target.closest(".idioma-entry").remove();
        }
    });

    // Navegación entre secciones
    const secciones = document.querySelectorAll(".seccion");
    let indiceActual = 0;

    function mostrarSeccion(index) {
        secciones.forEach((seccion, i) => {
            seccion.style.display = i === index ? "block" : "none";
        });
    }

    document.querySelectorAll(".siguiente").forEach(btn => {
        btn.addEventListener("click", () => {
            if (indiceActual < secciones.length - 1) {
                indiceActual++;
                mostrarSeccion(indiceActual);
            }
        });
    });

    document.querySelectorAll(".anterior").forEach(btn => {
        btn.addEventListener("click", () => {
            if (indiceActual > 0) {
                indiceActual--;
                mostrarSeccion(indiceActual);
            }
        });
    });

    mostrarSeccion(indiceActual);
});

document.addEventListener("DOMContentLoaded", function () {
    const ocupaciones = [
        "Arquitecto", "Ingeniero", "Doctor", "Abogado", "Diseñador",
        "Programador", "Profesor", "Administrador", "Contador"
    ];

    function llenarSelectOcupaciones(select) {
        ocupaciones.forEach(ocupacion => {
            let option = document.createElement("option");
            option.value = ocupacion;
            option.textContent = ocupacion;
            select.appendChild(option);
        });
    }

    document.querySelectorAll('select[name="cargo[]"]').forEach(llenarSelectOcupaciones);

    let contadorExperiencias = 2; // Empieza en 2 porque la primera ya existe

    function agregarExperiencia() {
        const div = document.createElement("div");
        div.classList.add("experiencia", "mb-3", "p-3", "border", "rounded", "shadow-sm");

        div.innerHTML = `
            <h4 class="titulo-experiencia">Experiencia Laboral ${contadorExperiencias}</h4>

            <div class="form-floating mb-3">
                <input type="text" name="nombre_de_empresa[]" class="form-control" placeholder=" ">
                <label>Nombre de la Empresa</label>
            </div>

            <div class="form-floating mb-3">
                <select name="cargo[]" class="form-control">
                    <option value="" disabled selected>Seleccione un cargo</option>
                </select>
                <label>Cargo</label>
            </div>

            <div class="form-floating mb-3">
                <input type="date" name="fecha_inicio_laboral[]" class="form-control" placeholder=" ">
                <label>Fecha Inicio</label>
            </div>

            <div class="form-floating mb-3">
                <input type="date" name="fecha_fin_laboral[]" class="form-control" placeholder=" ">
                <label>Fecha Fin</label>
            </div>

            <button type="button" class="btn btn-danger btn-sm mt-2 btn-eliminar">✖</button>
        `;

        document.getElementById("experiencias").appendChild(div);
        llenarSelectOcupaciones(div.querySelector("select[name='cargo[]']"));

        div.querySelector(".btn-eliminar").addEventListener("click", function () {
            div.remove();
            actualizarTitulos();
        });

        contadorExperiencias++; // Se incrementa después de agregar
    }

    function actualizarTitulos() {
        let experiencias = document.querySelectorAll("#experiencias .experiencia h4");
        experiencias.forEach((h4, index) => {
            h4.textContent = `Experiencia Laboral ${index + 2}`; // Comienza desde 2
        });
    }

    const btnAgregar = document.getElementById("btnAgregarExperiencia");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", agregarExperiencia);
    } else {
        console.error("No se encontró el botón #btnAgregarExperiencia");
    }


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

    document.querySelectorAll('select[name="idioma[]"]').forEach(select => llenarSelect(select, idiomas));
    document.querySelectorAll('select[name="nivel[]"]').forEach(select => llenarSelect(select, niveles));


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
                    <option value="" disabled selected>Seleccione el nivel</option>
                </select>
                <label>Nivel</label>
            </div>

            <button type="button" class="btn btn-danger btn-sm btn-eliminar-idioma">✖</button>
        `;

        document.getElementById("idiomas-container").appendChild(div);

        llenarSelect(div.querySelector("select[name='idioma[]']"), idiomas);
        llenarSelect(div.querySelector("select[name='nivel[]']"), niveles);
    }

    const btnAgregarIdioma = document.getElementById("btnAgregarIdioma");
    if (btnAgregarIdioma) {
        btnAgregarIdioma.addEventListener("click", agregarIdioma);
    } else {
        console.error("No se encontró el botón #btnAgregarIdioma");
    }

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


});
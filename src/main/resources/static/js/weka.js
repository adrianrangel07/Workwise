document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formPrediccion");
    const resultado = document.getElementById("resultado");
    const detallesPrediccion = document.getElementById("detallesPrediccion");
    const errorModelo = document.getElementById("errorModelo");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultado.innerHTML = '<div class="loading">Calculando compatibilidad...</div>';
        detallesPrediccion.innerHTML = '';
        errorModelo.innerHTML = '';

        const formData = new FormData(formulario);
        const datos = Object.fromEntries(formData.entries());


        function obtenerTipoEmpleo(obtenerEmpleo) {
            if (obtenerEmpleo === "Tiempo completo") {
                const tipoEmpleo = "Tiempo_Completo";
                return tipoEmpleo;
            }
            else if (obtenerEmpleo === "Medio tiempo") {
                const tipoEmpleo = "Medio_Tiempo";
                return tipoEmpleo;
            }
            else if (obtenerEmpleo === "Por horas") {
                const tipoEmpleo = "Por_Horas";
                return tipoEmpleo;
            }
            else if (obtenerEmpleo === "Temporal") {
                const tipoEmpleo = "Temporal";
                return tipoEmpleo;
            }

        }

        const obtenerEmpleot = document.getElementById("tipoEmpleoOferta").value;

        console.log(obtenerTipoEmpleo(obtenerEmpleot));
        console.log(datos.modalidad_oferta);
        console.log(datos.tipo_contrato_oferta);
        console.log(datos.nivel_estudio_requerido);
        console.log(datos.sector_oferta);
        console.log(datos.experiencia_requerida);

        // Calcular coincidencias
        const coincidencias = {
            coincide_tipo_empleo: obtenerTipoEmpleo(obtenerEmpleot) === datos.tipo_empleo_deseado ? "Si" : "No",
            coincide_modalidad: datos.modalidad_oferta === datos.preferencia_modalidad ? "Si" : "No",
            coincide_contrato: datos.tipo_contrato_oferta === datos.preferencia_contrato ? "Si" : "No",
            coincide_estudios: datos.nivel_estudio_requerido === datos.nivel_estudio_persona ? "Si" : "No",
            coincide_sector: datos.sector_oferta === datos.sector_persona ? "Si" : "No",
            experiencia_suficiente: parseFloat(datos.experiencia_persona) >= parseFloat(datos.experiencia_requerida) ? "Si" : "No"
        };
        const datosFinales = {
            tipoEmpleoOferta: obtenerTipoEmpleo(obtenerEmpleot),
            modalidadOferta: datos.modalidad_oferta,
            tipoContratoOferta: datos.tipo_contrato_oferta,
            experienciaRequerida: parseFloat(datos.experiencia_requerida),
            nivelEstudioRequerido: datos.nivel_estudio_requerido,
            sectorOferta: datos.sector_oferta,
            tipoEmpleoDeseado: datos.tipo_empleo_deseado,
            preferenciaModalidad: datos.preferencia_modalidad,
            preferenciaContrato: datos.preferencia_contrato,
            experienciaPersona: parseFloat(datos.experiencia_persona),
            nivelEstudioPersona: datos.nivel_estudio_persona,
            sectorPersona: datos.sector_persona,
            edadPersona: parseFloat(datos.edad_persona),
            coincideTipoEmpleo: coincidencias.coincide_tipo_empleo,
            coincideModalidad: coincidencias.coincide_modalidad,
            coincideContrato: coincidencias.coincide_contrato,
            coincideEstudios: coincidencias.coincide_estudios,
            coincideSector: coincidencias.coincide_sector,
            experienciaSuficiente: coincidencias.experiencia_suficiente
        };

        try {
            const response = await fetch("/api/prediccion/prediccion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosFinales)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detalle || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Mostrar resultados
            resultado.innerHTML = `
                <div class="resultado">
                    <h3>${data.compatible === "Si" ? "✅ Compatible" : "❌ No Compatible"}</h3>
                    <p><strong>rango de error:</strong> ${data.confianzaWeka.toFixed(3)}</p>
                </div>
            `;

            // Mostrar detalles de coincidencias
            detallesPrediccion.innerHTML = `
                <div class="detalles">
                    <h4>Detalles de la predicción:</h4>
                    <ul>
                        <li>Tipo empleo: ${coincidencias.coincide_tipo_empleo === "Si" ? "✅" : "❌"}</li>
                        <li>Modalidad: ${coincidencias.coincide_modalidad === "Si" ? "✅" : "❌"}</li>
                        <li>Contrato: ${coincidencias.coincide_contrato === "Si" ? "✅" : "❌"}</li>
                        <li>Estudios: ${coincidencias.coincide_estudios === "Si" ? "✅" : "❌"}</li>
                        <li>Sector: ${coincidencias.coincide_sector === "Si" ? "✅" : "❌"}</li>
                        <li>Experiencia suficiente: ${coincidencias.experiencia_suficiente === "Si" ? "✅" : "❌"}</li>
                    </ul>
                </div>
            `;

        } catch (error) {
            console.error("Error:", error);
            errorModelo.innerHTML = `
                <div class="error">
                    <p>Ocurrió un error al realizar la predicción:</p>
                    <p>${error.message}</p>
                </div>
            `;
            resultado.innerHTML = '';
        }
    });
});

// document.addEventListener('DOMContentLoaded', function () {
//     // Obtener el valor del atributo data-tipo-empleo
//     const tipoEmpleo = document.getElementById("tipoEmpleo").getAttribute("data-tipo-empleo");

//     // Verificar si el valor fue capturado
//     console.log("Tipo de empleo: " + tipoEmpleo);

//     // Asignar el valor al campo de entrada (input)
//     document.getElementById("tipoEmpleoOferta").value = tipoEmpleo;
// });

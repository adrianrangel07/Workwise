document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formPrediccion");
    const resultado = document.getElementById("resultado");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        resultado.innerHTML = '<div class="loading">Calculando compatibilidad...</div>';

        const formData = new FormData(formulario);
        const datos = Object.fromEntries(formData.entries());


        console.log(datos.tipo_empleo_deseado);
        console.log(datos.modalidad_oferta);
        console.log(datos.tipo_contrato_oferta);
        console.log(datos.nivel_estudio_requerido);
        console.log(datos.sector_oferta);
        console.log(datos.experiencia_requerida);

        // Calcular coincidencias
        const coincidencias = {
            coincide_tipo_empleo: datos.tipo_empleo_deseado === datos.tipo_empleo_deseado ? "Si" : "No",
            coincide_modalidad: datos.modalidad_oferta === datos.preferencia_modalidad ? "Si" : "No",
            coincide_contrato: datos.tipo_contrato_oferta === datos.preferencia_contrato ? "Si" : "No",
            coincide_estudios: datos.nivel_estudio_requerido === datos.nivel_estudio_persona ? "Si" : "No",
            coincide_sector: datos.sector_oferta === datos.sector_persona ? "Si" : "No",
            experiencia_suficiente: parseFloat(datos.experiencia_persona) >= parseFloat(datos.experiencia_requerida) ? "Si" : "No"
        };
        const datosFinales = {
            tipoEmpleoOferta: datos.tipo_empleo_deseado,
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
            resultado.style.backgroundColor = data.compatible === "Si" ? " #c2efdd" : "#f8d7da";
            const result = data.confianzaWeka.toFixed(3) * 100;
            resultado.innerHTML = `
                <div class="resultado">
                    <h3>${data.compatible === "Si" ? "✅ Compatible" : "❌ No Compatible"}</h3>
                    <p style="margin: 0;"><strong>rango de error:</strong> ${result}%</p>
                </div>
            `;

        } catch (error) {
            console.error("Error:", error);
            const contenedorError = document.getElementById("contenedor-error");
            contenedorError.innerHTML = ` 
                <div class="error">
                    <p>Ocurrió un error al realizar la predicción:</p>
                    <p>${error.message}</p>
                </div>
            `;
            resultado.innerHTML = '';
        }
        // 🔍 Obtener y mostrar recomendaciones visuales
        const usuarioData = {
            tipoEmpleoDeseado: datos.tipo_empleo_deseado,
            preferenciaModalidad: datos.preferencia_modalidad,
            preferenciaContrato: datos.preferencia_contrato,
            experienciaPersona: parseFloat(datos.experiencia_persona),
            nivelEstudioPersona: datos.nivel_estudio_persona,
            sectorPersona: datos.sector_persona,
            edadPersona: parseFloat(datos.edad_persona),
        };

        try {
            const response = await fetch("/api/prediccion/recomendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuarioData)
            });

            const recomendaciones = await response.json();
            mostrarRecomendaciones(recomendaciones);

        } catch (error) {
            console.error("Error:", error);
            mostrarError(error);
        }

        function mostrarRecomendaciones(recomendaciones) {
            const container = document.getElementById("recomendaciones-container");
            container.innerHTML = "";

            if (recomendaciones.length === 0) {
                container.innerHTML = "<p>No se encontraron ofertas compatibles con tu perfil.</p>";
                return;
            }

            recomendaciones.forEach(oferta => {
                const card = document.createElement("div");
                card.className = "oferta-card";
                card.innerHTML = `
                <h3>${oferta.titulo}</h3>
                <p>${oferta.empresa} - ${oferta.modalidad}</p>
                <p>Confianza: ${(oferta.confianza * 100).toFixed(1)}%</p>
                <!-- Más detalles de la oferta -->
            `;
                container.appendChild(card);
            });
        }
    });
});



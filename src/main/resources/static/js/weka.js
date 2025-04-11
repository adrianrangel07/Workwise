document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formPrediccion");
    const resultado = document.getElementById("resultado");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(formulario);
        const datos = Object.fromEntries(formData.entries());

        // Calcular coincidencias automáticamente
        const coincidencias = {
            coincide_tipo_empleo: datos.tipo_empleo_oferta === datos.tipo_empleo_deseado ? "Si" : "No",
            coincide_modalidad: datos.modalidad_oferta === datos.preferencia_modalidad ? "Si" : "No",
            coincide_contrato: datos.tipo_contrato_oferta === datos.preferencia_contrato ? "Si" : "No",
            coincide_estudios: datos.nivel_estudio_requerido === datos.nivel_estudio_persona ? "Si" : "No",
            coincide_sector: datos.sector_oferta === datos.sector_persona ? "Si" : "No",
            experiencia_suficiente: parseFloat(datos.experiencia_persona) >= parseFloat(datos.experiencia_requerida) ? "Si" : "No"
        };

        const datosFinales = {
            tipoEmpleoOferta: datos.tipo_empleo_oferta,
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosFinales)
            });

            if (!response.ok) {
                throw new Error("Error al obtener la predicción: " + response.status);
            }

            const data = await response.json();

            resultado.innerHTML = `
                <p>✅ Predicción: <strong>${data.compatible === "Si" ? "Compatible" : "No Compatible"}</strong></p>
                <p>🔢 Porcentaje de Aceptación: <strong>${data.porcentaje}%</strong></p>
            `;
            resultado.style.color = data.compatible === "Si" ? "#27ae60" : "#e74c3c";

        } catch (error) {
            console.error("Error en la predicción:", error);
            resultado.innerHTML = "<p style='color: red;'>❌ No se pudo realizar la predicción.</p>";
        }
    });
});

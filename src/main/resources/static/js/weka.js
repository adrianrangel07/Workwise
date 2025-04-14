document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formPrediccion");
    const resultado = document.getElementById("resultado");
    const errorModelo = document.getElementById("errorModelo");
    const detallesPrediccion = document.getElementById("detallesPrediccion");

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosFinales)
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();

            // Mostrar resultados usando solo los campos recibidos
            resultado.innerHTML = `
                <div class="resultado">
                    <h3>${data.compatible === "Si" ? "✅ Compatible" : "❌ No Compatible"}</h3>
                    <p><strong>Valor WEKA:</strong> ${data.confianzaWeka.toFixed(3)}</p>
                </div>
            `;

        } catch (error) {
            console.error("Error:", error);
            resultado.innerHTML = `<div class="error">${error.message}</div>`;
        }
    });
});
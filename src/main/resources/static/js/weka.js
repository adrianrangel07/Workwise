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

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const recomendaciones = await response.json();
            console.log("Respuesta del servidor:", recomendaciones); // Para depuración
            mostrarRecomendaciones(recomendaciones);

        } catch (error) {
            console.error("Error:", error);
            mostrarError("No se pudieron cargar las recomendaciones. Intenta nuevamente.");
        }

        function mostrarRecomendaciones(recomendaciones) {
            const container = document.getElementById("recomendaciones-container");
            container.innerHTML = "";

            if (!recomendaciones || recomendaciones.length === 0) {
                container.innerHTML = "<p class='text-muted'>No se encontraron ofertas compatibles con tu perfil.</p>";
                return;
            }
            document.getElementById('recommendations-header').style.display = 'block';

            recomendaciones.forEach(oferta => {
                const contendor = document.createElement("div");
                contendor.className = "offer-container";
                contendor.innerHTML = `
                <div class="card">
                    <div class="applied-compatibilidad">
                        <i class="fas fa-check-circle"></i>
                        <span>Compatible</span>
                    </div>
                    <div class="offer-content">
                        <h3 style="margin-top: 25px">${oferta.titulo || 'Sin título'}</h3>
                        <p class="text-truncate">${oferta.descripcion || ''}</p>
                    </div>
                </div>
                `;

                const card = contendor.querySelector(".card");
                card.addEventListener("click", () => {
                    abrirModalConOferta(oferta);
                });

                container.appendChild(contendor);
            });

            function abrirModalConOferta(oferta) {
                // Obtener elementos del modal
                const modal = document.getElementById('modal');
                const modalTitle = document.getElementById('modal-title');
                const modalDescription = document.getElementById('modal-description');

                // Llenar los campos del modal
                modalTitle.textContent = oferta.titulo || 'Sin título';
                modalDescription.textContent = oferta.descripcion || '';

                // Llenar los demás campos (ajusta según tu DTO)
                document.getElementById('modal-salary').textContent = `Salario: ${oferta.salario || 'No especificado'}`;
                document.getElementById('modal-currency').textContent = `Moneda: ${oferta.moneda || 'No especificada'}`;
                document.getElementById('modal-duration').textContent = `Duración: ${oferta.duracion || 'No especificada'}`;
                document.getElementById('modal-period').textContent = `Periodo: ${oferta.periodo || 'No especificado'}`;
                document.getElementById('modal-modalidad').textContent = `Modalidad: ${oferta.modalidad || 'No especificada'}`;
                document.getElementById('modal-type').textContent = `Tipo: ${oferta.tipoEmpleo || 'No especificado'}`;
                document.getElementById('modal-typeContract').textContent = `Contrato: ${oferta.tipoContrato || 'No especificado'}`;
                document.getElementById('modal-empresa').textContent = `Empresa: ${oferta.nombreEmpresa || 'No especificada'}`;

                // Mostrar el modal
                modal.style.display = 'block';

                // Configurar botón de cierre
                document.getElementById('close-btn').onclick = function () {
                    modal.style.display = 'none';
                }

                // Cerrar al hacer clic fuera del modal
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = 'none';
                    }
                }
                const postularseBtn = document.getElementById('postularse');

                postularseBtn.addEventListener("click", function () {
                    const ofertaId = oferta.idOferta
                    const usuarioId = document.getElementById('usuarioId')?.value;

                    if (!ofertaId || !usuarioId) {
                        Swal.fire('Error', 'Faltan datos necesarios', 'error');
                        console.log('Faltan datos necesarios para postularse:', { ofertaId, usuarioId });
                        return;
                    }

                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¿Quieres postularte a esta oferta?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, postularme'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`/postularse`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ofertaId: ofertaId,
                                    usuarioId: usuarioId
                                })
                            })
                                .then(response => {
                                    if (!response.ok) throw new Error('Error en la respuesta');
                                    return response.json();
                                })
                                .then(data => {
                                    if (data.success) {
                                        // Cierra el modal después de postularse
                                        document.getElementById('modal').style.display = 'none';
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Postulación exitosa',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    } else {
                                        Swal.fire('Info', data.message || 'Ya estás postulado', 'info');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire('Error', 'Hubo un problema al postularse', 'error');
                                });
                        }
                    });
                });
            }
        }
    });
});





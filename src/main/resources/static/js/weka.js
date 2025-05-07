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

document.addEventListener('DOMContentLoaded', function () {
    const edadInput = document.querySelector('input[name="edad_persona"]');
    const experienciaSelect = document.getElementById('experiencia');


    const opcionesExperiencia = [
        { value: 5, text: "Coloque una edad validad", minAge: -1000, maxAge: 17 },
        { value: 0, text: "Sin experiencia", minAge: 18, maxAge: 150 },
        { value: 1, text: "Menos de 1 año", minAge: 18, maxAge: 150 },
        { value: 2, text: "Entre 1 y 3 años", minAge: 19, maxAge: 150 },
        { value: 3, text: "Entre 3 y 5 años", minAge: 21, maxAge: 150 },
        { value: 4, text: "Entre 5 y 10 años", minAge: 23, maxAge: 150 },
        { value: 5, text: "Más de 10 años", minAge: 28, maxAge: 150 }
    ];

    function actualizarOpcionesExperiencia() {
        const edad = parseInt(edadInput.value) || 18;

        experienciaSelect.innerHTML = '';


        opcionesExperiencia.forEach(opcion => {
            if (edad >= opcion.minAge && edad <= opcion.maxAge) {
                const option = document.createElement('option');
                option.value = opcion.value;
                option.textContent = opcion.text;
                experienciaSelect.appendChild(option);
            }
        });

        // Validación adicional para edades muy jóvenes
        if (edad < 18) {
            experienciaSelect.value = "5"; // Auto-seleccionar "Sin experiencia"
        }
        else if (edad < 19) {
            experienciaSelect.value = "0"
        }
    }

    // Event listeners
    edadInput.addEventListener('input', actualizarOpcionesExperiencia);

    // Validación al enviar el formulario
    document.querySelector('form').addEventListener('submit', function (e) {
        const edad = parseInt(edadInput.value);
        const experiencia = parseInt(experienciaSelect.value);

        if (isNaN(edad) || isNaN(experiencia)) {
            e.preventDefault();
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Validación cruzada final
        const opcionSeleccionada = opcionesExperiencia.find(op => op.value === experiencia);
        if (edad < opcionSeleccionada.minAge || edad > opcionSeleccionada.maxAge) {
            e.preventDefault();
            alert('La experiencia seleccionada no es coherente con tu edad');
            experienciaSelect.focus();
        }
    });

    // Inicializar al cargar
    actualizarOpcionesExperiencia();
});

document.addEventListener('DOMContentLoaded', function () {
    const edadInput = document.querySelector('input[name="edad_persona"]');
    const estudioSelect = document.querySelector('select[name="nivel_estudio_persona"]');

    // Relación edad-nivel de estudio (edad mínima para cada nivel)
    const opcionesEstudio = [
        { value: "Coloque una edad validad", text: "Coloque una edad validad", minAge: -1000, maxAge: 17 },
        { value: "Sin_estudios", text: "Sin estudios", minAge: 18, maxAge: 150 },
        { value: "Bachiller", text: "Bachiller", minAge: 18, maxAge: 150 },
        { value: "Tecnico_Tecnologo", text: "Técnico/Tecnólogo", minAge: 18, maxAge: 150 },
        { value: "Tecnologo_Universitario", text: "Tecnólogo o Universitario", minAge: 18, maxAge: 150 },
        { value: "Universitario", text: "Universitario", minAge: 22, maxAge: 150 },
        { value: "Master", text: "Master", minAge: 27, maxAge: 150 },
        { value: "Doctorado", text: "Doctorado", minAge: 33, maxAge: 150 }
    ];

    function actualizarOpcionesEstudio() {
        const edad = parseInt(edadInput.value) || 18;

        // Guardar selección actual
        const selectedValue = estudioSelect.value;

        // Limpiar y repoblar opciones
        estudioSelect.innerHTML = '';

        // Agregar opciones válidas para la edad
        opcionesEstudio.forEach(opcion => {
            if (edad >= opcion.minAge && edad <= opcion.maxAge) {
                const option = document.createElement('option');
                option.value = opcion.value;
                option.textContent = opcion.text;
                estudioSelect.appendChild(option);
            }
        });

        // Restaurar selección si sigue siendo válida
        if (Array.from(estudioSelect.options).some(opt => opt.value === selectedValue)) {
            estudioSelect.value = selectedValue;
        } else if (edad < 18) {
            estudioSelect.value = "Coloque una edad validad";
        }
    }

    // Validación al cambiar edad
    edadInput.addEventListener('input', actualizarOpcionesEstudio);

    // Validación al enviar el formulario
    document.querySelector('form').addEventListener('submit', function (e) {
        const edad = parseInt(edadInput.value);
        const estudio = estudioSelect.value;

        if (isNaN(edad)) {
            e.preventDefault();
            alert('Por favor ingresa una edad válida');
            edadInput.focus();
            return;
        }

        const opcionSeleccionada = opcionesEstudio.find(op => op.value === estudio);

        if (!opcionSeleccionada || edad < opcionSeleccionada.minAge || edad > opcionSeleccionada.maxAge) {
            e.preventDefault();
            alert('El nivel de estudio seleccionado no es coherente con tu edad');
            estudioSelect.focus();
        }
    });

    // Inicializar al cargar
    actualizarOpcionesEstudio();
});


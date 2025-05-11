document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formPrediccion");
    const resultado = document.getElementById("resultado");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

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

        function isValorInvalido(valor) {
            return valor === null || valor === undefined || valor === "" || valor === "6";
        }

        if (
            isValorInvalido(datosFinales.tipoEmpleoDeseado) ||
            isValorInvalido(datosFinales.preferenciaContrato) ||
            isValorInvalido(datosFinales.preferenciaModalidad) ||
            isValorInvalido(datosFinales.experienciaPersona) ||
            isValorInvalido(datosFinales.nivelEstudioPersona) ||
            isValorInvalido(datosFinales.sectorPersona) ||
            isValorInvalido(datosFinales.edadPersona)
        ) {
            Swal.fire({
                title: 'Campos incompletos',
                text: "Por favor complete los campos que estan en rojo.",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido'
            });
            const campos = [
                { selector: 'select[name="tipo_empleo_deseado"]', valor: datosFinales.tipoEmpleoDeseado },
                { selector: 'select[name="preferencia_contrato"]', valor: datosFinales.preferenciaContrato },
                { selector: 'select[name="preferencia_modalidad"]', valor: datosFinales.preferenciaModalidad },
                { selector: 'select[name="experiencia_persona"]', valor: datosFinales.experienciaPersona },
                { selector: 'select[name="nivel_estudio_persona"]', valor: datosFinales.nivelEstudioPersona },
                { selector: 'select[name="sector_persona"]', valor: datosFinales.sectorPersona },
                { selector: 'input[name="edad_persona"]', valor: datosFinales.edadPersona }
            ];

            campos.forEach(({ selector, valor }) => {
                const el = document.querySelector(selector);
                if (el && isValorInvalido(valor)) {
                    el.classList.add('invalid');
                }
            });

            // Quitar clase invalid cuando se modifica
            document.querySelectorAll('select, input').forEach(element => {
                element.addEventListener('focus', () => {
                    element.classList.remove('invalid');
                });
            });
        } else {
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

        if (usuarioData.tipoEmpleoDeseado == null || usuarioData.preferenciaContrato == null || usuarioData.preferenciaModalidad == null
            || usuarioData.experienciaPersona == null || usuarioData.nivelEstudioPersona == null
            || usuarioData.sectorPersona == null || usuarioData.edadPersona == null) {
            console.error("Error: Datos de usuario incompletos para recomendaciones.");
            console.error(usuarioData);
            Swal.fire({
                title: 'Campos incompletos',
                text: "Por favor completa todos los campos requeridos para obtener recomendaciones.",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Entendido'
            });
        } else {
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

                const recomendacionesFiltradas = recomendaciones.filter(oferta =>
                    oferta.sector === usuarioData.sectorPersona
                );
                mostrarRecomendaciones(recomendacionesFiltradas);

            } catch (error) {
                console.error("Error:", error);
            }

            function mostrarRecomendaciones(recomendaciones) {
                const container = document.getElementById("recomendaciones-container");
                const contenedor_card = document.getElementById("contenedor-tarjeta");

                contenedor_card.innerHTML = "";

                if (!recomendaciones || recomendaciones.length === 0) {
                    document.getElementById('recommendations-header').style.display = 'block';
                    contenedor_card.innerHTML = "<p class='text-muted'>No se encontraron ofertas compatibles con tu perfil.</p>";
                    return;
                } else {
                    document.getElementById('recommendations-header').style.display = 'block';
                    recomendaciones.forEach(oferta => {
                        const contenedor = document.createElement("div");
                        contenedor.className = "card";
                        contenedor.innerHTML = `
                        <div class="applied-compatibilidad">
                            <i class="fas fa-check-circle"></i>
                            <span>Compatible</span>
                        </div>
                        <div class="offer-content">
                            <h3 style="margin-top: 25px">${oferta.titulo || 'Sin título'}</h3>
                            <p class="text-truncate">${oferta.descripcion || ''}</p>
                        </div>
                        `;

                        contenedor.addEventListener("click", () => {
                            abrirModalConOferta(oferta);
                        });
                        contenedor_card.appendChild(contenedor);
                    });
                }

                function abrirModalConOferta(oferta) {
                    // Obtener elementos del modal
                    const modal = document.getElementById('modal');
                    const modalTitle = document.getElementById('modal-title');
                    const modalDescription = document.getElementById('modal-description');

                    // Llenar los campos del modal
                    modalTitle.textContent = oferta.titulo || 'Sin título';
                    modalDescription.textContent = oferta.descripcion || '';

                    function convertirExperiencia(experiencia) {
                        switch (experiencia) {
                            case 0:
                                return "Sin experiencia";
                            case 1:
                                return "Menos de 1 año";
                            case 2:
                                return "Entre 1 y 3 años";
                            case 3:
                                return "Entre 3 y 5 años";
                            case 4:
                                return "Entre 5 y 10 años";
                            case 5:
                                return "Más de 10 años";
                            default:
                                return "No especificada";
                        }
                    }
                    function convertirEducacion(nivelEducativo) {
                        switch (nivelEducativo) {
                            case "Sin_estudios":
                                return "Sin estudios";
                            case "Bachiller":
                                return "Bachiller";
                            case "Tecnico_Tecnologo":
                                return "Técnico/Tecnólogo";
                            case "Tecnologo_Universitario":
                                return "Tecnólogo o Universitario";
                            case "Universitario":
                                return "Universitario";
                            case "Master":
                                return "Máster";
                            case "Doctorado":
                                return "Doctorado";
                            default:
                                return "No especificada";
                        }
                    }

                    // Llenar los demás campos (ajusta según tu DTO)
                    document.getElementById('modal-salary').textContent = `Salario: ${oferta.salario || 'No especificado'}`;
                    document.getElementById('modal-currency').textContent = `Moneda: ${oferta.moneda || 'No especificada'}`;
                    document.getElementById('modal-duration').textContent = `Duración: ${oferta.duracion || 'No especificada'}`;
                    document.getElementById('modal-period').textContent = `Periodo: ${oferta.periodo || 'No especificado'}`;
                    document.getElementById('modal-modalidad').textContent = `Modalidad: ${oferta.modalidad || 'No especificada'}`;
                    document.getElementById('modal-type').textContent = `Tipo: ${oferta.tipoEmpleo || 'No especificado'}`;
                    document.getElementById('modal-typeContract').textContent = `Contrato: ${oferta.tipoContrato || 'No especificado'}`;
                    document.getElementById('modal-sector').textContent = `Sector: ${oferta.sector || 'No especificado'}`;
                    document.getElementById('modal-experience').textContent = `Experiencia: ${convertirExperiencia(oferta.experiencia) || 'No especificada'}`;
                    document.getElementById('modal-education').textContent = `Educación: ${convertirEducacion(oferta.nivelEstudio) || 'No especificada'}`;
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
                                }).then(response => {
                                    if (!response.ok) throw new Error('Error en la respuesta');
                                    return response.json();
                                }).then(data => {
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
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const edadInput = document.querySelector('input[name="edad_persona"]');
    const experienciaSelect = document.getElementById('experiencia');
    const labeloption = document.getElementById('label-experiencia');


    const opcionesExperiencia = [
        { value: 0, text: "Sin experiencia", minAge: 18, maxAge: 150 },
        { value: 1, text: "Menos de 1 año", minAge: 18, maxAge: 150 },
        { value: 2, text: "Entre 1 y 3 años", minAge: 19, maxAge: 150 },
        { value: 3, text: "Entre 3 y 5 años", minAge: 21, maxAge: 150 },
        { value: 4, text: "Entre 5 y 10 años", minAge: 23, maxAge: 150 },
        { value: 5, text: "Más de 10 años", minAge: 28, maxAge: 150 },
        { value: 6, text: "", disabled: true, selected: true, hidden: true }
    ];

    function actualizarOpcionesExperiencia() {
        const edad = parseInt(edadInput.value) || null;

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
        if (edad == null || edad < 18) {
            labeloption.textContent = "Coloque una edad válida";
            experienciaSelect.value = 6;
            experienciaSelect.disabled = true;
        }
        else if (edad >= 18) {
            experienciaSelect.disabled = false;
            labeloption.textContent = "Seleccione Su Experiencia Laboral";
            experienciaSelect.value = 7;
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
            alert('Por favor completa todos los campos');
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
    const estudioSelect = document.getElementById('nivel_educativo');
    const labeloption = document.getElementById('label-estudio');

    // Relación edad-nivel de estudio (edad mínima para cada nivel)
    const opcionesEstudio = [
        { value: "Sin_estudios", text: "Sin estudios", minAge: 18, maxAge: 150 },
        { value: "Bachiller", text: "Bachiller", minAge: 18, maxAge: 150 },
        { value: "Tecnico_Tecnologo", text: "Técnico/Tecnólogo", minAge: 18, maxAge: 150 },
        { value: "Tecnologo_Universitario", text: "Tecnólogo o Universitario", minAge: 18, maxAge: 150 },
        { value: "Universitario", text: "Universitario", minAge: 22, maxAge: 150 },
        { value: "Master", text: "Master", minAge: 27, maxAge: 150 },
        { value: "Doctorado", text: "Doctorado", minAge: 33, maxAge: 150 },
        { value: 6, text: "", disabled: true, selected: true, hidden: true }

    ];

    function actualizarOpcionesEstudio() {
        const edad = parseInt(edadInput.value) || null;

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

        if (edad == null || edad < 18) {
            labeloption.textContent = "Seleccione Su Nivel De Estudio";
            estudioSelect.value = 6;
            estudioSelect.disabled = true;
        }
        else if (edad >= 18) {
            estudioSelect.disabled = false;
            labeloption.textContent = "Seleccione Su Nivel De Estudio";
            estudioSelect.value = 6;
        }

    }

    // Validación al cambiar edad
    edadInput.addEventListener('input', actualizarOpcionesEstudio);

    // Validación al enviar el formulario
    document.querySelector('form').addEventListener('submit', function (e) {
        const edad = parseInt(edadInput.value);
        const estudio = estudioSelect.value;

        if (isNaN(edad) || estudio == null) {
            e.preventDefault();
            alert('Por favor completa todos los campos requers');
            console.log(edad, estudio);
            return;
        }

        // Validación cruzada final
        const opcionSeleccionada = opcionesEstudio.find(op => op.value === estudio);
        if (edad < opcionSeleccionada.minAge || edad > opcionSeleccionada.maxAge) {
            e.preventDefault();
            alert('La experiencia seleccionada no es coherente con tu edad');
            estudioSelect.focus();
        }
    });

    // Inicializar al cargar
    actualizarOpcionesEstudio();
});


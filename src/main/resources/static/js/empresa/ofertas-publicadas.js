document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todas las tarjetas
    const cards = document.querySelectorAll('.offer-content');

    // Elementos de la sección 2
    const detalleTitulo = document.getElementById('detalle-titulo');
    const detalleDescripcion = document.getElementById('detalle-descripcion');
    const detalleSalario = document.getElementById('detalle-salario');
    const detalleMoneda = document.getElementById('detalle-moneda');
    const detalleDuracion = document.getElementById('detalle-duracion');
    const detallePeriodo = document.getElementById('detalle-periodo');
    const detalleModalidad = document.getElementById('detalle-modalidad');
    const detalleTipo = document.getElementById('detalle-tipo');
    const detalleTipoContrato = document.getElementById('detalle-tipoContrato');

    // Función para mostrar los detalles en la Sección 2
    const mostrarDetalles = (card) => {
        // Obtener los datos de la tarjeta
        const title = card.querySelector('h3').innerText;
        const description = card.querySelector('p').innerText;
        const salary = card.querySelector('.salario span').innerText;
        const currency = card.querySelector('.moneda span').innerText;
        const duration = card.querySelector('.duracion span').innerText;
        const period = card.querySelector('.periodo span').innerText;
        const type = card.querySelector('.tipo_empleo span').innerText;
        const modalidad = card.querySelector('.modalidad span').innerText;
        const typeContract = card.querySelector('.tipo_contrato span').innerText;

        // Llenar la Sección 2 con los datos de la tarjeta
        detalleTitulo.innerText = title;
        detalleDescripcion.innerText = description;
        detalleSalario.innerHTML = `<strong>Salario:</strong> ${salary}`;
        detalleMoneda.innerHTML = `<strong>Moneda:</strong> ${currency}`;
        detalleDuracion.innerHTML = `<strong>Duración:</strong> ${duration}`;
        detallePeriodo.innerHTML = `<strong>Periodo:</strong> ${period}`;
        detalleModalidad.innerHTML = `<strong>Modalidad:</strong> ${modalidad}`;
        detalleTipo.innerHTML = `<strong>Tipo de empleo:</strong> ${type}`;
        detalleTipoContrato.innerHTML = `<strong>Tipo de contrato:</strong> ${typeContract}`;
    };

    // Agregar evento 'click' a cada tarjeta para mostrar la información en la Sección 2
    cards.forEach(card => {
        card.addEventListener('click', function () {
            mostrarDetalles(card);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".salario span").forEach(function (element) {
        let value = element.textContent.trim();
        if (!isNaN(value) && value !== "") {
            element.textContent = Number(value).toLocaleString("es-CO");
        }
    });
});

function cargarPostulantes(idOferta) {
    fetch(`/ofertas/${idOferta}/postulaciones`)
        .then(response => response.json())
        .then(data => {
            let listado = document.getElementById("listaPostulantes");
            listado.innerHTML = "";
            data.forEach(persona => {
                let li = document.createElement("li");
                li.textContent = `${persona.nombre} ${persona.apellido}`;
                let linkCV = document.createElement("a");
                linkCV.href = `/descargar-cv/${persona.id}`;
                linkCV.textContent = " Ver CV";
                linkCV.target = "_blank";
                li.appendChild(linkCV);
                listado.appendChild(li);
            });
        })
        .catch(error => console.error("Error al obtener postulantes:", error));
}

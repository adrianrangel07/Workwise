document.addEventListener("DOMContentLoaded", function () {
    let estadosElementos = document.querySelectorAll(".estado"); // Selecciona TODOS los estados

    estadosElementos.forEach(estadoElemento => {
        let estadoTexto = estadoElemento.querySelector("span").innerText.trim().toLowerCase();
        console.log("Estado encontrado:", estadoTexto);

        // Asignar clase según el estado
        switch (estadoTexto) {
            case "pendiente":
                estadoElemento.style.color = "black";
                estadoElemento.style.backgroundColor = "yellow";
                break;
            case "aceptado":
                estadoElemento.style.color = "white";
                estadoElemento.style.backgroundColor = "green";
                break;
            case "rechazado":
                estadoElemento.style.color = "white";
                estadoElemento.style.backgroundColor = "red";
                break;
            default:
                estadoElemento.style.color = "black";
                estadoElemento.style.backgroundColor = "lightgray"; // Color por defecto
                break;
        }
    });
});
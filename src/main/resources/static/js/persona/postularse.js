const postularseBtn = document.getElementById("postularseBtn");
postularseBtn.addEventListener("click", function () {
    const ofertaId = parseInt(postularseBtn.getAttribute("data-oferta-id"), 10);
    const usuarioId = document.getElementById("usuarioId").value;


    Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres postularte a esta oferta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, postularme",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/postularse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ofertaId: ofertaId,
                    usuarioId: usuarioId,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Actualizar el estado visual
                        const card = document
                            .querySelector(`.card .offer-content[data-id="${ofertaId}"]`)
                            .closest(".card");
                        if (card) {
                            const appliedIcon = document.createElement("div");
                            appliedIcon.className = "applied-icon";
                            appliedIcon.setAttribute("data-id", ofertaId);
                            appliedIcon.innerHTML =
                                '<i class="fas fa-check-circle"></i><span>Postulado</span>';
                            card.insertBefore(appliedIcon, card.firstChild);
                        }

                        Swal.fire({
                            title: "Postulación exitosa",
                            text: data.message,
                            icon: "success",
                            timer: 3000,
                            showConfirmButton: false,
                        }).then(() => {
                            postularseBtn.textContent = "Postulado";
                        });
                    } else {
                        Swal.fire({
                            title: "Ya estás postulado",
                            text: data.message,
                            icon: "info",
                            timer: 3000,
                            showConfirmButton: false,
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al postularse. Inténtalo de nuevo más tarde.",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                });
        }
    });
});
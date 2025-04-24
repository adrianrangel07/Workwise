document.getElementById('jobOfferForm').addEventListener('submit', function (event) {
    event.preventDefault();

    Swal.fire({
        icon: 'success',
        title: 'Oferta Publicada',
        text: '¡Tu oferta ha sido publicada exitosamente!',
    }).then(() => {
        this.submit();
    });
});

function cancelarOferta() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se perderán los cambios no guardados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "/empresas/pagina_principal";
        }
    });
}

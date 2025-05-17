document.addEventListener("DOMContentLoaded", function () {
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const cancelUploadBtn = document.getElementById("cancelUploadBtn");
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.querySelector('input[name="file"]');
  const profileImage = document.getElementById("profileImage");

  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSize = 500 * 1024; // 10MB

  function validarArchivo(file) {
    if (!file) return false;

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato inválido",
        text: "Solo se permiten imágenes JPG o PNG.",
      });
      fileInput.value = "";
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Imagen demasiado grande",
        text: "La imagen debe pesar menos de 500kb.",
      });
      fileInput.value = "";
      return false;
    }

    return true;
  }

  changePhotoBtn.addEventListener("click", function () {
    uploadForm.style.display = "block";
    cancelUploadBtn.style.display = "inline-block";
    changePhotoBtn.style.display = "none";
  });

  cancelUploadBtn.addEventListener("click", function (event) {
    event.preventDefault();
    uploadForm.reset();
    uploadForm.style.display = "none";
    cancelUploadBtn.style.display = "none";
    changePhotoBtn.style.display = "inline-block";
  });

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      if (validarArchivo(file)) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profileImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  });

  uploadForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Sin archivo",
        text: "Por favor selecciona una imagen antes de enviar.",
      });
      return;
    }

    if (!validarArchivo(file)) {
      return; // No enviar si no pasa validación
    }

    const formData = new FormData(this);

    fetch("/upload/photo", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Foto actualizada",
            text: "Tu foto de perfil ha sido cambiada exitosamente.",
            confirmButtonText: "Ok",
          }).then(() => {
            document.getElementById("user-avatar").src =
              "/imagen/perfil?" + new Date().getTime();
            location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al subir la imagen.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error inesperado al intentar subir la imagen.",
        });
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("uploadFormcv");
  const fileInput = document.getElementById("fileInput");
  const pdfViewer = document.getElementById("pdfViewer");

  const maxFileSize = 2 * 1024 * 1024; // 2MB máximo

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Sin archivo",
        text: "Por favor selecciona un archivo PDF.",
      });
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      Swal.fire({
        icon: "error",
        title: "Formato inválido",
        text: "Solo se permiten archivos PDF.",
      });
      fileInput.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "El PDF debe pesar menos de 2MB.",
      });
      fileInput.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("/uploadHDV", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.includes("Error")) {
          Swal.fire({
            icon: "error",
            title: "Error al subir",
            text: data,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Subido correctamente",
            text: data,
          }).then(() => {
            form.reset();
            pdfViewer.src = "/perfil/verHDV?" + new Date().getTime(); // Evita caché
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: error.message,
        });
      });
  });
});

// Función para eliminar hoja de vida
function eliminarHojaDeVida() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará tu hoja de vida.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, borrar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/eliminarHDV", {
        method: "POST",
      })
        .then((response) => response.text())
        .then((data) => {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: data,
          }).then(() => {
            document.getElementById("pdfViewer").src = ""; // Quitar el PDF
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la hoja de vida.",
          });
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const changeButton = document.getElementById("change_btn");
  const saveButton = document.getElementById("save_btn");
  const form = document.querySelector("form");
  const birthdateInput = document.getElementById("birthdate");

  // Establecer fecha máxima para el campo de nacimiento (hoy - 12 años)
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100); // 100 años atrás
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 12); // Mínimo 12 años

  birthdateInput.max = maxDate.toISOString().split("T")[0];
  birthdateInput.min = minDate.toISOString().split("T")[0];

  changeButton.addEventListener("click", function () {
    // Animación suave al abrir la sección
    document.querySelector(".card-body").style.opacity = "0";
    document.querySelector(".card-body").style.transition = "opacity 0.3s ease";

    Swal.fire({
      title: "Verificación requerida",
      text: "Ingresa tu contraseña para hacer cambios:",
      input: "password",
      inputPlaceholder: "Contraseña",
      inputAttributes: {
        autocapitalize: "off",
        "aria-label": "Ingresa tu contraseña",
      },
      showCancelButton: true,
      confirmButtonText: "Verificar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "animated fadeIn", // Animación al mostrar el modal
      },
    }).then((result) => {
      document.querySelector(".card-body").style.opacity = "1";

      if (result.isConfirmed && result.value) {
        verificarContraseña(result.value);
      } else {
        location.reload();
      }
    });
  });

  function verificarContraseña(password) {
    fetch("/verificar-contrasena/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valido) {
          document.getElementById("confirmPassword").value = password;
          habilitarEdicion();
        } else {
          Swal.fire({
            icon: "error",
            title: "Contraseña incorrecta",
            text: "Inténtalo nuevamente.",
            customClass: {
              popup: "animated shake", // Animación de error
            },
          }).then(() => location.reload());
        }
      })
      .catch((error) => {
        console.error("Error en la verificación:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al verificar la contraseña.",
        });
      });
  }

  function habilitarEdicion() {
    // Animación al habilitar la edición
    const cardBody = document.querySelector(".card-body");
    cardBody.style.transform = "scale(0.98)";
    cardBody.style.transition = "transform 0.3s ease";

    setTimeout(() => {
      cardBody.style.transform = "scale(1)";
    }, 300);

    // Habilita todos los campos editables
    document
      .querySelectorAll(
        'input:not([type="email"]):not([type="password"]), select'
      )
      .forEach((input) => {
        input.disabled = false;
      });

    saveButton.disabled = false;
    saveButton.focus(); // Mejora de accesibilidad
  }
});

function eliminarCuenta() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará tu cuenta permanentemente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Mostrar loader
      Swal.fire({
        title: "Procesando",
        html: "Eliminando tu cuenta...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Enviar solicitud DELETE
      fetch("/eliminar-cuenta", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || "Error al eliminar cuenta");
            });
          }
          return response.text();
        })
        .then((message) => {
          Swal.fire({
            title: "¡Éxito!",
            text: message || "Cuenta eliminada correctamente",
            icon: "success",
            timer: 3000,
          }).then(() => {
            window.location.href = "/login/personas";
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            title: "Error",
            text: error.message || "Ocurrió un error al eliminar la cuenta",
            icon: "error",
          });
        });
    }
  });
}

function cerrarSesionYRedirigir(event) {
  event.preventDefault(); // Evita la navegación inmediata

  Swal.fire({
    title: "Cerrando sesión...",
    text: "Estamos cerrando tu sesión. Por favor, espera.",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading(); // Muestra un loader

      // Enviar la solicitud de cierre de sesión
      fetch("/logout", { method: "POST" })
        .then((response) => {
          // Esperamos 2 segundos antes de redirigir, asegurando que la sesión se cierre
          setTimeout(() => {
            window.location.href = "/login/Empresa";
          }, 2000);
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error);
          Swal.fire("Error", "No se pudo cerrar la sesión.", "error");
        });
    },
  });
}

// Variables para verificación de email
let currentEmail = "";
let verificationRequested = false;

function iniciarVerificacionEmail(event) {
  if (event) event.preventDefault();

  currentEmail = document.getElementById("email").value;
  const modal = new bootstrap.Modal(
    document.getElementById("verificationModal")
  );
  modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
  const email = document.getElementById("email").value;
  if (email) {
    fetch(`/api/is-verified?email=${encodeURIComponent(email)}`)
      .then((response) => response.json())
      .then((isVerified) => {
        if (isVerified) {
          updateEmailVerificationUI(true);
        }
      });
  }
});

function updateEmailVerificationUI(isVerified) {
  const verifyBtn = document.getElementById("verifyEmailBtn");
  const statusText = document.getElementById("emailStatus");

  if (isVerified) {
    if (verifyBtn) verifyBtn.style.display = "none";
    if (statusText) {
      statusText.textContent = "Correo verificado";
      statusText.className = "form-text text-success";
      statusText.innerHTML =
        '<i class="fas fa-check-circle"></i> Correo verificado';
    }
  } else {
    if (verifyBtn) verifyBtn.style.display = "inline-block";
    if (statusText) {
      statusText.textContent = "Correo no verificado";
      statusText.className = "form-text text-warning";
    }
  }
}

function enviarCodigoVerificacion(event) {
  if (event) event.preventDefault();

  const url = "/api/send-verification-email";
  const email = document.getElementById("email").value;

  // Opción 1: Enviar como JSON (recomendado)
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.error || "Error en la solicitud");
        });
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("step1").style.display = "none";
      document.getElementById("step2").style.display = "block";
      document.getElementById(
        "verificationResult"
      ).innerHTML = `<div class="alert alert-info">${data.message}</div>`;
    })
    .catch((error) => {
      document.getElementById(
        "verificationResult"
      ).innerHTML = `<div class="alert alert-danger">Error al enviar el código: ${error.message}</div>`;
      console.error("Error:", error);
    });
}

function verificarCodigo() {
  const code = document.getElementById("verificationCode").value;

  if (!code) {
    document.getElementById("verificationResult").innerHTML =
      '<div class="alert alert-warning">Por favor ingresa el código</div>';
    return;
  }

  fetch("/api/verify-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `email=${encodeURIComponent(currentEmail)}&code=${encodeURIComponent(
      code
    )}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message && data.message.includes("éxito")) {
        document.getElementById(
          "verificationResult"
        ).innerHTML = `<div class="alert alert-success">${data.message}</div>`;
        updateEmailVerificationUI(true);

        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          $("#verificationModal").modal("hide");
        }, 2000);
      } else {
        document.getElementById(
          "verificationResult"
        ).innerHTML = `<div class="alert alert-danger">${
          data.error || "Error al verificar el código"
        }</div>`;
      }
    })
    .catch((error) => {
      document.getElementById(
        "verificationResult"
      ).innerHTML = `<div class="alert alert-danger">Error al verificar: ${error.message}</div>`;
    });
}

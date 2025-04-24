document.addEventListener("DOMContentLoaded", () => {
  const userActionsDiv = document.getElementById("user-actions");
  const loggedIn = localStorage.getItem("loggedIn");

  // Verificar si el usuario ha iniciado sesión
  if (loggedIn === "true") {
    userActionsDiv.style.display = "block"; // Mostrar el contenedor del botón
  }

  // Redirigir al usuario a la página de actualización
  const updateButton = document.getElementById("update-user-page-button");
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      window.location.href = "./Usercontrol.html"; // Ruta al archivo
    });
  } else {
    console.error("Botón de actualización no encontrado");
  }

  const backButton = document.getElementById("back-to-home");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "./index.html"; // Asegúrate de que la ruta sea correcta
    });
  }

  // Crear elemento para mostrar notificaciones estilizadas
  const notificationContainer = document.createElement("div");
  notificationContainer.id = "notification-container";
  notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 350px;
        z-index: 9999;
    `;
  document.body.appendChild(notificationContainer);
});

// Función para mostrar notificaciones estilizadas
function showNotification(message, isSuccess = true) {
  const notification = document.createElement("div");
  notification.style.cssText = `
        background-color: ${isSuccess ? "#4CAF50" : "#b22227"};
        color: white;
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  const messageText = document.createElement("div");
  messageText.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0 5px;
    `;
  closeButton.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  });

  notification.appendChild(messageText);
  notification.appendChild(closeButton);

  const container = document.getElementById("notification-container");
  container.appendChild(notification);

  // Mostrar notificación con animación
  setTimeout(() => (notification.style.transform = "translateX(0)"), 10);

  // Auto cerrar después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

document
  .getElementById("update-user-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Asegúrate de guardar el userId al iniciar sesión
    const name = document.getElementById("update-name").value;
    const email = document.getElementById("update-email").value;
    const password = document.getElementById("update-password").value;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const message = await response.text();

      if (response.ok) {
        showNotification("¡Usuario actualizado correctamente!", true);
        // Limpiar campos después de actualización exitosa
        document.getElementById("update-user-form").reset();
      } else {
        showNotification("Error: " + message, false);
      }
    } catch (error) {
      showNotification(
        "Error de conexión. Inténtalo de nuevo más tarde.",
        false
      );
      console.error("Error:", error);
    }
  });

document
  .getElementById("add-direction-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Asegúrate de guardar el userId al iniciar sesión
    const street = document.getElementById("street").value;
    const neighborhood = document.getElementById("neighborhood").value;
    const zipCode = document.getElementById("zip-code").value;
    const country = document.getElementById("country").value;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/add-direction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ street, neighborhood, zipCode, country }),
        }
      );

      const message = await response.text();

      if (response.ok) {
        showNotification("¡Dirección agregada con éxito!", true);
        // Limpiar campos después de agregar dirección exitosamente
        document.getElementById("add-direction-form").reset();
      } else {
        showNotification("Error: " + message, false);
      }
    } catch (error) {
      showNotification(
        "Error de conexión. Inténtalo de nuevo más tarde.",
        false
      );
      console.error("Error:", error);
    }
  });

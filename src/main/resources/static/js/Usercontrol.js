document.addEventListener('DOMContentLoaded', () => {
    const userActionsDiv = document.getElementById('user-actions');
    const loggedIn = localStorage.getItem('loggedIn');

    // Verificar si el usuario ha iniciado sesión
    if (loggedIn === 'true') {
        userActionsDiv.style.display = 'block'; // Mostrar el contenedor del botón
    }

    // Redirigir al usuario a la página de actualización
    const updateButton = document.getElementById('update-user-page-button');
    if (updateButton) {
        updateButton.addEventListener('click', () => {
            window.location.href = './Usercontrol.html'; // Ruta al archivo
        });
    } else {
        console.error('Botón de actualización no encontrado');
    }
});


document.getElementById('update-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Asegúrate de guardar el userId al iniciar sesión
    const name = document.getElementById('update-name').value;
    const email = document.getElementById('update-email').value;
    const password = document.getElementById('update-password').value;

    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const message = await response.text();
    alert(message);
});

document.getElementById('add-direction-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Asegúrate de guardar el userId al iniciar sesión
    const street = document.getElementById('street').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const zipCode = document.getElementById('zip-code').value;
    const country = document.getElementById('country').value;

    const response = await fetch(`http://localhost:8080/api/users/${userId}/add-direction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ street, neighborhood, zipCode, country })
    });

    const message = await response.text();
    alert(message);
});

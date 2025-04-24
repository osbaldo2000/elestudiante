document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const loggedIn = localStorage.getItem('loggedIn');

    // Verifica si el usuario está logueado y muestra el botón de cierre de sesión
    if (loggedIn === 'true') {
        logoutButton.style.display = 'block';
    }

    // Maneja el evento de clic para cerrar sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId'); // Elimina el userId
        alert('Sesión cerrada correctamente');
        window.location.href = 'productos.html'; // Redirigir a la página de inicio de sesión
    });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', data.userId); // Guardar el userId
            alert('Inicio de sesión exitoso');
            window.location.href = 'productos.html';
        }
    } else {
        alert('Correo o contraseña incorrectos');
    }
});

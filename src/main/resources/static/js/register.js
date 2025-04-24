document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (response.ok) {
            const message = await response.text();
            alert(message);
            window.location.href = 'productos.html'; // Redirige al inicio de sesión
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        alert(`Error al conectar con el servidor: ${error.message}`);
    }
});
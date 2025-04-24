let carrito = [];

// Agrega un producto al carrito o incrementa su cantidad si ya existe
function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.productId === producto.productId);
    if (existe) {
        existe.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }
    actualizarCarrito();
}

// Actualiza la visualización del carrito y calcula el total
function actualizarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    const totalP = document.getElementById('total');
    carritoDiv.innerHTML = '';
    let total = 0;

    carrito.forEach(p => {
        const linea = document.createElement('p');
        linea.textContent = `${p.name} x ${p.quantity} = $${(p.price * p.quantity).toFixed(2)}`;
        carritoDiv.appendChild(linea);
        total += p.price * p.quantity;
    });

    totalP.textContent = `Total: $${total.toFixed(2)}`;
}

// Procesa el pedido enviando los datos al servidor
function hacerPedido() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert('Debes iniciar sesión para hacer un pedido');
        window.location.href = 'login.html';
        return;
    }

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Aseguramos que los items tengan la estructura correcta para el backend
    const items = carrito.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
    }));

    const payload = {
        userEmail: userEmail,
        items: items
    };
    
    console.log('Enviando datos al servidor:', payload);

    fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
    .then(response => {
        console.log('Respuesta del servidor:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Respuesta de error:', text);
                throw new Error(`Error al enviar el pedido: ${response.status} - ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta exitosa:', data);
        alert('¡Pedido realizado con éxito!');
        carrito = [];
        actualizarCarrito();
    })
    .catch(err => {
        console.error('Error procesando el pedido:', err);
        alert('Hubo un error al procesar el pedido. Inténtalo de nuevo.');
    });
}

// Función para probar el carrito con un producto de ejemplo
function probarProducto() {
    const productoPrueba = {
        productId: 1,  
        name: "Hamburguesa",
        price: 89.00
    };
    agregarAlCarrito(productoPrueba);
}
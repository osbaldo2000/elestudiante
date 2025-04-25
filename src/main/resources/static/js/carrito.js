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

// Elimina un producto del carrito
function eliminarDelCarrito(productId) {
    const indice = carrito.findIndex(p => p.productId === productId);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        actualizarCarrito();
    }
}

// Reducir la cantidad de un producto en el carrito
function reducirCantidad(productId) {
    const producto = carrito.find(p => p.productId === productId);
    if (producto) {
        if (producto.quantity > 1) {
            producto.quantity -= 1;
        } else {
            eliminarDelCarrito(productId);
        }
        actualizarCarrito();
    }
}

// Actualiza la visualización del carrito y calcula el total
function actualizarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    const totalP = document.getElementById('total');
    carritoDiv.innerHTML = '';
    let total = 0;
    
    carrito.forEach(p => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.marginBottom = '10px';
        
        // Información del producto
        const infoDiv = document.createElement('div');
        infoDiv.textContent = `${p.name} x ${p.quantity} = $${(p.price * p.quantity).toFixed(2)}`;
        
        // Botones de control
        const botonesDiv = document.createElement('div');
        
        // Botón reducir cantidad
        const reducirBtn = document.createElement('button');
        reducirBtn.textContent = '-';
        reducirBtn.className = 'btn-control';
        reducirBtn.style.marginRight = '5px';
        reducirBtn.style.padding = '2px 8px';
        reducirBtn.onclick = () => reducirCantidad(p.productId);
        
        // Botón eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = '🗑️';
        eliminarBtn.className = 'btn-eliminar';
        eliminarBtn.style.padding = '2px 8px';
        eliminarBtn.onclick = () => eliminarDelCarrito(p.productId);
        
        // Agregar botones al div de botones
        botonesDiv.appendChild(reducirBtn);
        botonesDiv.appendChild(eliminarBtn);
        
        // Agregar info y botones al item
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(botonesDiv);
        
        // Agregar item al carrito
        carritoDiv.appendChild(itemDiv);
        
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
function butonBaguete() {
    const bagueteMilanesa = {
        productId: 2,
        name: "Baguete Milanesa",
        price: 105.00
    };
    agregarAlCarrito(bagueteMilanesa);

}
function butonChilaquilesPollo() {
    const chilaquilesPollo = {
        productId: 3,
        name: "Chilaquiles de Pollo",
        price: 115.00
    };
    agregarAlCarrito(chilaquilesPollo);
}
function butonHuevosDivorciados() {
    const huevosDivorciados = {
        productId: 4,
        name: "Huevos Divorciados",
        price: 50.00
    };
    agregarAlCarrito(huevosDivorciados);
}
function butonMargarita() {
    const margarita = {
        productId: 5,
        name: "Margarita",
        price: 75.00
    };
    agregarAlCarrito(margarita);
}
function butonCubaLibre() {
    const cubaLibre = {
        productId: 6,
        name: "Cuba Libre",
        price: 60.00
    };
    agregarAlCarrito(cubaLibre);
}
function butonMojito() {
    const mojito = {
        productId: 7,
        name: "Mojito",
        price: 85.00
    };
    agregarAlCarrito(mojito);
}
function butonSangria() {
    const sangria = {
        productId: 8,
        name: "Sangria",
        price: 89.00
    };
    agregarAlCarrito(sangria);
}
function butonAlambre() {
    const alambre = {
        productId: 9,
        name: "Alambre",
        price: 165.00
    };
    agregarAlCarrito(alambre);
}
function butonArrachera() {
    const arrachera = {
        productId: 10,
        name: "Arrachera",
        price:170.00
    };
    agregarAlCarrito(arrachera);
}
function butonBistecAsado() {
    const bistecAsado = {
        productId: 11,
        name: "Bistec Asado",
        price: 145.00
    };
    agregarAlCarrito(bistecAsado);
}
function butonEnsaladaPollo() {
    const ensaldaPollo = {
        productId: 12,
        name: "Ensalada de Pollo",
        price: 145.00
    };
    agregarAlCarrito(ensaldaPollo);
    }
function butonEnsaladaBistec() {
    const ensaldaBistec = {
        productId: 13,
        name: "Ensalada de Bistec",
        price: 115.00
    };
    agregarAlCarrito(ensaldaBistec);
}
function butonRebanadaPastel() {
    const rebanadaPastel = {
        productId: 14,
        name: "Rebanada de Pastel",
        price: 45.00
    };
    agregarAlCarrito(rebanadaPastel);
}
function butonHotCakes() {
    const hotCakes = {
        productId: 15,
        name: "Hot Cakes",
        price: 70.00
    };
    agregarAlCarrito(hotCakes);
}
function butonPanFrances() {
    const panFrances = {
    productId: 16,
    name: "Pan Frances",
    price: 75.00
    };
    agregarAlCarrito(panFrances)
}
function butonLatte() {
    const latte = {
    productId: 17,
    name: "Latte",
    price: 35.00
    };
    agregarAlCarrito(latte)
}
function butonCapuccinoMenta() {
    const capuccinoMenta = {
    productId: 18,
    name: "Capuccino Menta",
    price: 48.00
    };
    agregarAlCarrito(capuccinoMenta)
}
function butonCapuccino() {
    const capuccino = {
    productId: 19,
    name: "Capuccino",
    price: 35.00
    };
    agregarAlCarrito(capuccino)
}
function butonTe() {
    const te = {
    productId: 20,
    name: "Te",
    price: 28.00
    };
    agregarAlCarrito(te)
}
function butonTizana() {
    const tizana = {
    productId: 21,
    name: "Tizana",
    price: 55.00
    };
    agregarAlCarrito(tizana)
}
function butonFrappe() {
    const frappe = {
    productId: 22,
    name: "Frappe",
    price: 50.00
    };
    agregarAlCarrito(frappe)
}
function butonFrappeCajeta() {
    const frappeCajeta = {
    productId: 23,
    name: "Frappe de Cajeta",
    price: 60.00
    };
    agregarAlCarrito(frappeCajeta)
}
function butonMalteadaFresa() {
    const malteadaFresa = {
    productId: 24,
    name: "Malteada Fresa",
    price: 61.00
    };
    agregarAlCarrito(malteadaFresa)
}
function butonBistecMexa() {
    const bistecMexa = {
    productId: 25,
    name: "Bistec Mexa",
    price: 145.00
    };
    agregarAlCarrito(bistecMexa)
}
function butonChoriqueso() {
    const choriqueso = {
    productId: 26,
    name: "Choriqueso",
    price: 125.00
    };
    agregarAlCarrito(choriqueso)
}
function butonGrillChicken() {
    const grillChicken = {
    productId: 27,
    name: "Grill Chicken",
    price: 145.00
    };
    agregarAlCarrito(grillChicken)
}
function butonPlatoMilanesa() {
    const platoMilanesa = {
    productId: 28,
    name: "Plato de Milanesa",
    price: 175.00
    };
    agregarAlCarrito(platoMilanesa)
}
function butonConga() {
    const conga = {
    productId: 29,
    name: "Conga",
    price: 45.00
    };
    agregarAlCarrito(conga)
}
function butonAguaJamaica() {
    const aguaJamaica = {
    productId: 30,
    name: "Agua de Jamaica",
    price: 20.00
    };
    agregarAlCarrito(aguaJamaica)
}
function butonLimonada() {
    const limonada = {
    productId: 31,
    name: "Limonada",
    price: 35.00
    };
    agregarAlCarrito(limonada)
}
function butonAlitas() {
    const alitas = {
    productId: 32,
    name: "Alitas",
    price: 105.00
    };
    agregarAlCarrito(alitas)
}
function butonBoneless() {
    const boneless = {
    productId: 33,
    name: "Boneless",
    price: 105.00
    };
    agregarAlCarrito(boneless)
}
function butonDedosQueso() {
    const dedosQueso = {
    productId: 34,
    name: "Dedos de Queso",
    price: 75.00
    };
    agregarAlCarrito(dedosQueso)
}
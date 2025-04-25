/*Comprobamos en pagina panel de usuario si el usuario esta logeado si no lo redirigimos a la pagina de login*/
document.addEventListener('DOMContentLoaded', () => {
    const userActionsDiv = document.getElementById('user-actions');
    const loggedIn = localStorage.getItem('loggedIn');
    
    // Obtener la página actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Páginas que no requieren redirección aunque el usuario no esté logueado
    const publicPages = ['productos.html'];
    
    // Verificar si el usuario ha iniciado sesión
    if (loggedIn === 'true') {
        // Si está logueado, mostrar acciones de usuario
        if (userActionsDiv) {
            userActionsDiv.style.display = 'block';
        }
        
        // Configurar botón de actualización
        const updateButton = document.getElementById('update-user-page-button');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                window.location.href = './Usercontrol.html';
            });
        } else {
            console.error('Botón de actualización no encontrado');
        }
    } else {
        // Si no está logueado y no es una página pública, redirigir a login
        const isPublicPage = publicPages.some(page => currentPage === page);
        
        if (!isPublicPage) {
            window.location.href = './login.html';
        }
    }
});
/*Comprobamos en pagina panel de usuario si el usuario esta logeado si no lo redirigimos a la pagina de login*/

/*Codigo actualizar usuario*/
document.getElementById('update-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem('userId'); // Asegúrate de guardar el userId al iniciar sesión
  const name = document.getElementById('update-name').value;
  const email = document.getElementById('update-email').value;
  const password = document.getElementById('update-password').value;

  const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
  });

  const message = await response.text();
  alert(message);

  if (response.ok) {
      window.location.reload(); // Recargar la página si la actualización fue exitosa
  }
});
/*Codigo actualizar usuario*/

/*Codigo para mostrar las ordenes del usuario logeado*/
document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('orders-container');
    const userId = localStorage.getItem('userId'); 

    try {
        // Hacer la solicitud al endpoint correcto
        const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
        if (!response.ok) throw new Error(`Error al obtener las órdenes: ${response.statusText}`);

        const orders = await response.json();
        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = `<p>No se encontraron órdenes para este usuario.</p>`;
            return;
        }

        // Generar el HTML para las órdenes
        let ordersHTML = '';
        orders.forEach(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let orderTotal = 0;
            let productsHTML = '';
            order.orderDetails.forEach(detail => {
                const itemTotal = detail.quantity * detail.unitPrice;
                orderTotal += itemTotal;

                productsHTML += `
                    <div class="product-item">
                        <div>
                            <span class="product-name">${detail.product.name}</span>
                            <span class="text-sm"> x ${detail.quantity}</span>
                        </div>
                        <div>
                            <span>$${detail.unitPrice.toFixed(2)} c/u</span>
                            <span class="ml-4 font-bold">$${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                `;
            });

            ordersHTML += `
                <div class="order-container" id="order-${order.orderId}">
                    <div class="order-header">
                        <div class="flex items-center">
                            <button class="show-details" onclick="toggleOrderDetails(${order.orderId})">Ver Detalles</button>
                            <!-- Botón Borrar que ahora llama a la función de eliminación -->
                            <button class="delete-order" onclick="deleteOrder(${order.orderId})" style="margin-left: 10px;">Borrar</button>
                        </div>
                        <div>
                            <h3 class="order-title">Pedido #${order.orderId}</h3>
                            <p class="order-date">${orderDate}</p>
                        </div>                        
                    </div>
                    <div id="order-details-${order.orderId}" class="order-details" style="display: none;">
                        <h4 class="text-lg font-bold mb-2">Productos:</h4>
                        ${productsHTML}
                        <div class="order-total">
                            Total: $${orderTotal.toFixed(2)}
                        </div>
                    </div>
                </div>
            `;
        });

        // Actualizar el contenedor con las órdenes
        ordersContainer.innerHTML = ordersHTML;
    } catch (error) {
        console.error('Error:', error);
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <h2 class="mb-4 text-xl">Error al cargar las órdenes</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
});

// Función para mostrar/ocultar detalles de la orden
function toggleOrderDetails(orderId) {
    const detailsElement = document.getElementById(`order-details-${orderId}`);
    detailsElement.style.display = detailsElement.style.display === 'block' ? 'none' : 'block';
}

// Función para eliminar un pedido
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Error al eliminar la orden: ${response.statusText}`);

        // Eliminar el pedido del DOM
        const orderElement = document.getElementById(`order-${orderId}`);
        if (orderElement) {
            orderElement.remove();
        }

        alert('Pedido eliminado correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al eliminar el pedido.');
    }
}
/*Codigo para mostrar las ordenes del usuario logeado*/

/*Codigo para agregar una direccion*/
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
        body: JSON.stringify({ street, neighborhood, zipCode, country }),
    });
  
    const message = await response.text();
    alert(message);
  
    if (response.ok) {
        window.location.reload(); // Recargar la página si la dirección se agregó correctamente
    }
  });
  /*Codigo para agregar una direccion*/

  /*Codigo para borrar user*/
  document.getElementById('delete-user').addEventListener('click', async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('El ID de usuario no está disponible.');
        return;
    }
    
    // Confirmar la eliminación
    if (!confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const message = await response.text();
        
        if (response.ok) {
            alert('Usuario eliminado correctamente');
            // Borrar los datos en localStorage
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('loggedIn');
            
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = './login.html';
        } else {
            console.error('Error al eliminar el usuario:', message);
            alert('Hubo un problema al eliminar el usuario: ' + message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Ocurrió un error al intentar eliminar el usuario.');
    }
});
/*Codigo para borrar user*/

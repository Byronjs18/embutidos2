let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Cargar productos desde la API
async function cargarProductos() {
  const res = await fetch('/productos');
  const productos = await res.json();
  const contenedor = document.getElementById('productos');

  contenedor.innerHTML = productos.map(p => `
  <div class="product-card">
    <img src="${p.imagen || 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/Y4556Q3G7VAATENAVY6XULWMQ4.jpg'}" alt="${p.nombre}" class="img-fluid">
    <h3>${p.nombre}</h3>
    <p>${p.descripcion}</p>
    <p>Q${Number(p.precio).toFixed(2)}</p>
    <button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${Number(p.precio)}, '${p.imagen || 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg'}')">
      Agregar al carrito
    </button>
  </div>
`).join('');

}

// Agregar al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
  carrito.push({ id, nombre, precio: Number(precio), imagen });
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

// Mostrar carrito
function mostrarCarrito() {
  const cont = document.getElementById('carrito');
  const contador = document.getElementById('contadorCarrito');

  if (!carrito.length) {
    cont.innerHTML = '<p>El carrito está vacío</p>';
    contador.textContent = "0";
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  cont.innerHTML =
    carrito.map((p, i) => `
      <div class="carrito-item d-flex align-items-center mb-2">
        <img src="${p.imagen}" alt="${p.nombre}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
        <span>${p.nombre} - Q${p.precio.toFixed(2)}</span>
        <button class="eliminar-btn btn btn-sm btn-danger ms-auto" data-index="${i}">❌</button>
      </div>
    `).join('') +
    `<div><strong>Total: Q${total.toFixed(2)}</strong></div>`;

  contador.textContent = carrito.length;

  // Agregar eventos a los botones de eliminar
  cont.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      eliminarDelCarrito(btn.dataset.index);
    });
  });
}

// Enviar carrito por WhatsApp
document.getElementById('enviarWhatsapp').addEventListener('click', () => {
  if (!carrito.length) return alert("El carrito está vacío");

  const mensaje = carrito.map(p => `${p.nombre} - Q${p.precio.toFixed(2)}`).join('%0A');
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  const mensajeCompleto = `${mensaje}%0ATotal: Q${total.toFixed(2)}`;

  window.open(`https://wa.me/50249701580?text=${mensajeCompleto}`, '_blank');
});

// Hacer funciones accesibles desde el HTML
window.agregarAlCarrito = agregarAlCarrito;

// Mostrar carrito al cargar la página
mostrarCarrito();
cargarProductos();

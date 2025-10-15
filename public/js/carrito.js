let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Cargar productos desde la API
async function cargarProductos() {
  try {
    const res = await fetch('/productos');
    const data = await res.json();


    const productos = Array.isArray(data) ? data : [];

    if (!productos.length) {
      console.warn('No hay productos disponibles');
      document.getElementById('productos').innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = productos.map(p => `
  <div class="col-6 col-md-4 col-lg-2 d-flex justify-content-center">
    <div class="card producto-card flex-fill text-center">
      <img src="${p.imagen || 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/Y4556Q3G7VAATENAVY6XULWMQ4.jpg'}" 
           class="card-img-top" 
           alt="${p.nombre}">
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text text-secondary small">${p.descripcion}</p>
        </div>
        <div>
          <p class="card-text precio fw-bold">Q${Number(p.precio).toFixed(2)}</p>
          <button 
            onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${Number(p.precio)}, '${p.imagen || 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg'}')" 
            class="btn btn-primary w-100">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
`).join('');


  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
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
document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let datosUsuario = {}; // Guardamos los datos del usuario

  // Mostrar carrito
  function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const carritoCount = document.getElementById('carrito-count');

    if (!carritoItems || !carritoTotal || !carritoCount) return; // seguridad

    if (!carrito.length) {
      carritoItems.innerHTML = '<tr><td colspan="4">El carrito está vacío</td></tr>';
      carritoTotal.textContent = "0.00";
      carritoCount.textContent = "0";
      return;
    }

    let total = 0;
    carritoItems.innerHTML = carrito.map((p, i) => {
      const subtotal = p.precio * (p.cantidad || 1);
      total += subtotal;
      return `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.cantidad || 1}</td>
          <td>Q${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${i})">❌</button>
          </td>
        </tr>
      `;
    }).join('');

    carritoTotal.textContent = total.toFixed(2);
    carritoCount.textContent = carrito.length;

    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Agregar al carrito
  window.agregarAlCarrito = function (id, nombre, precio, imagen) {
    carrito.push({ id, nombre, precio: Number(precio), imagen });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }

  // Eliminar del carrito
  window.eliminarDelCarrito = function (index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }

  // Botón Pagar
  document.getElementById("btn-pagar").addEventListener("click", async () => {
    // Cargar el HTML del formulario
    const res = await fetch("form-user.html");
    const html = await res.text();

    const modalBody = document.querySelector("#carritoModal .modal-body");
    modalBody.innerHTML = html;

    cargarDepartamentos(); // cargar select de departamentos

    const carritoModal = new bootstrap.Modal(document.getElementById("carritoModal"));
    carritoModal.show(); // abrir modal UNA vez cargado todo

    const btnConfirmarFormulario = modalBody.querySelector("#confirmarFormulario");
    btnConfirmarFormulario.addEventListener("click", (e) => {
      e.preventDefault();

      // Validar campos
      const campos = ["nombre", "direccion", "dpi", "departamento", "municipio", "telefono", "correo"];
      let valido = true;

      campos.forEach(id => {
        const input = modalBody.querySelector(`#${id}`);
        if (!input || !input.value.trim()) valido = false;
        datosUsuario[id] = input.value.trim(); // aquí sí usamos la variable global
      });

      if (!valido) {
        alert("Por favor completa todos los campos.");
        return;
      }

      console.log("Datos del usuario:", datosUsuario);

      // Cerrar modal del carrito
      carritoModal.hide();

      // Abrir modal de confirmación
      const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);
      document.getElementById("totalPedido").textContent = total.toFixed(2);

      const confirmarModal = new bootstrap.Modal(document.getElementById("confirmarPedidoModal"));
      confirmarModal.show();
    }, { once: true });
  });


  // Confirmar pedido y enviar WhatsApp
  document.getElementById("finalizarPedidoBtn").addEventListener("click", async () => {
    const numTransaccion = document.getElementById("numTransaccion").value;
    if (!numTransaccion) {
      alert("Ingresa el número de transacción antes de confirmar");
      return;
    }

    const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);
    const productosTexto = carrito.map(p => `${p.nombre} x${p.cantidad || 1} - Q${(p.precio * (p.cantidad || 1)).toFixed(2)}`).join('\n');

    // Guardar pedido en la base de datos
    try {
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_cliente: datosUsuario.nombre,
          direccion: datosUsuario.direccion,
          dpi: datosUsuario.dpi,
          departamento: datosUsuario.departamento,
          municipio: datosUsuario.municipio,
          telefono: datosUsuario.telefono,
          correo: datosUsuario.correo,
          productos: productosTexto,
          total,
          numero_transaccion: numTransaccion
        })
      });



    } catch (err) {
      console.error("Error al guardar pedido:", err);
    }

    // Enviar mensaje a WhatsApp
    const mensaje = `Hola, quiero realizar un pedido:%0A
Nombre: ${datosUsuario.nombre}%0A
Dirección: ${datosUsuario.direccion}%0A
DPI: ${datosUsuario.dpi}%0A
Departamento/Municipio: ${datosUsuario.departamento} / ${datosUsuario.municipio}%0A
Teléfono: ${datosUsuario.telefono}%0A
Correo: ${datosUsuario.correo}%0A
Productos:%0A${productosTexto.replace(/\n/g, '%0A')}%0A
Total: Q${total.toFixed(2)}%0A
Número de transacción: ${numTransaccion}`;

    window.open(`https://wa.me/50242775644?text=${mensaje}`, '_blank');

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    location.reload();

    const confirmarModal = bootstrap.Modal.getInstance(document.getElementById("confirmarPedidoModal"));
    confirmarModal.hide();
  });
  function validarFormulario(modalBody) {
    const nombre = modalBody.querySelector("#nombre")?.value.trim();
    const direccion = modalBody.querySelector("#direccion")?.value.trim();
    const dpi = modalBody.querySelector("#dpi")?.value.trim();
    const departamento = modalBody.querySelector("#departamento")?.value;
    const municipio = modalBody.querySelector("#municipio")?.value;
    const telefono = modalBody.querySelector("#telefono")?.value.trim();
    const correo = modalBody.querySelector("#correo")?.value.trim();

    if (!nombre || !direccion || !dpi || !departamento || !municipio || !telefono || !correo) {
      alert("Por favor complete todos los campos antes de confirmar.");
      return false;
    }

    if (!/^[0-9]{13}$/.test(dpi)) {
      alert("DPI inválido. Debe contener 13 números.");
      return false;
    }

    if (!/^[0-9]{8}$/.test(telefono)) {
      alert("Teléfono inválido. Debe contener 8 números.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Correo electrónico inválido.");
      return false;
    }

    return true;
  }


  // Inicializar
  mostrarCarrito();
  cargarProductos();
});

// Cargar productos
async function cargarProductos() {
    try {
        const res = await fetch('/productos');
        const productos = await res.json();
        const cont = document.getElementById('listaProductos');

        cont.innerHTML = productos.map(p => `
        <div class="product-card-admin">
            <img src="${p.imagen || ''}" alt="${p.nombre}">
            <span>${p.nombre} - ${p.categoria} - Q${Number(p.precio).toFixed(2)}</span>
            <div>
            <button onclick="editarFormulario(${p.id})">Editar</button>
            <button onclick="eliminar(${p.id})">Eliminar</button>
            </div>
        </div>
        `).join('');

    } catch (err) {
        console.error(err);
    }
}

// Crear o actualizar producto
document.getElementById('formProducto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const producto = Object.fromEntries(formData.entries());

    // URL por defecto si imagen está vacía
    producto.imagen = producto.imagen && producto.imagen.trim() !== ''
        ? producto.imagen
        : 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg';

    try {
        let url = '/productos/crear';
        let method = 'POST';

        if (producto.id) {
            url = `/productos/editar/${producto.id}`;
            method = 'PUT';
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        const data = await res.json();
        alert(data.mensaje || 'Producto guardado');

        e.target.reset();
        document.getElementById('productoId').value = ''; // limpiar id
        cargarProductos();
    } catch (err) {
        console.error(err);
        alert('Error al guardar el producto');
    }
});

// Función para editar producto
async function editarFormulario(id) {
    try {
        const res = await fetch(`/productos/${id}`);
        const p = await res.json();

        document.getElementById('productoId').value = p.id;
        document.querySelector('input[name="nombre"]').value = p.nombre;

        const select = document.querySelector('select[name="categoria"]');
        Array.from(select.options).forEach(opt => {
            opt.selected = opt.value === p.categoria;
        });

        document.querySelector('input[name="descripcion"]').value = p.descripcion;
        document.querySelector('input[name="precio"]').value = p.precio;
        document.querySelector('input[name="imagen"]').value = p.imagen;
    } catch (err) {
        console.error(err);
        alert('Error al cargar el producto para edición');
    }
}

// Eliminar producto
async function eliminar(id) {
    try {
        await fetch(`/productos/eliminar/${id}`, { method: 'DELETE' });
        cargarProductos();
    } catch (err) {
        console.error(err);
        alert('Error al eliminar el producto');
    }
}

// Cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
});

// Inicializar lista
cargarProductos();

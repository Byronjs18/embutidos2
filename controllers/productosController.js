const pool = require('../models/db');

// Obtener todos los productos
exports.listarProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar productos:', err);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// ✅ Obtener un producto por ID
exports.obtenerProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// Crear producto
exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, categoria, precio, imagen } = req.body;
  try {
    await pool.query(
      'INSERT INTO productos (nombre, descripcion, categoria, precio, imagen) VALUES ($1, $2, $3, $4, $5)',
      [nombre, descripcion, categoria, precio, imagen]
    );
    res.json({ mensaje: 'Producto creado correctamente' });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// Editar producto
exports.editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, categoria, precio, imagen } = req.body;
  try {
    await pool.query(
      'UPDATE productos SET nombre=$1, descripcion=$2, categoria=$3, precio=$4, imagen=$5 WHERE id=$6',
      [nombre, descripcion, categoria, precio, imagen, id]
    );
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ mensaje: 'Error al editar producto' });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id=$1', [id]);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

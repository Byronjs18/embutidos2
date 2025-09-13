const productoModel = require('../models/productoModel');

module.exports = {
  listarProductos: (req, res) =>
    productoModel.listar((err, results) => 
      err ? res.status(500).json(err) : res.json(results)
    ),

  crearProducto: (req, res) => {
  const nuevoProducto = {
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    imagen: req.body.imagen // <-- aquí incluimos la URL
  };

  productoModel.crear(nuevoProducto, (err, result) => 
    err ? res.status(500).json(err) : res.json({ mensaje: "Producto creado" })
  );
},
obtenerProducto: (req, res) => {
  const id = req.params.id;
  productoModel.obtenerPorId(id, (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(result[0]);
  });
},



  editarProducto: (req, res) => {
  const { nombre, categoria, descripcion, precio, imagen } = req.body;
  productoModel.actualizar(req.params.id, { nombre, categoria, descripcion, precio, imagen }, (err, result) =>
    err ? res.status(500).json(err) : res.json({ mensaje: "Producto actualizado" })
  );
},

  eliminarProducto: (req, res) =>
    productoModel.eliminar(req.params.id, (err, result) =>
      err ? res.status(500).json(err) : res.json({ mensaje: "Producto eliminado" })
    )
};

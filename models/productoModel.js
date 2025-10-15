const db = require('./db'); // tu Pool de pg

module.exports = {
  listar: (callback) => {
    const sql = "SELECT * FROM productos";
    db.query(sql, [], callback);
  },

  crear: (producto, callback) => {
    const { nombre, categoria, descripcion, precio } = producto;
    let imagen = producto.imagen && producto.imagen.trim() !== '' 
        ? producto.imagen 
        : 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg';

    const sql = `
      INSERT INTO productos (nombre, categoria, descripcion, precio, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    db.query(sql, [nombre, categoria, descripcion, precio, imagen], callback);
  },

  actualizar: (id, producto, callback) => {
    const { nombre, categoria, descripcion, precio, imagen } = producto;
    let img = imagen && imagen.trim() !== '' 
        ? imagen 
        : 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg';

    const sql = `
      UPDATE productos
      SET nombre=$1, categoria=$2, descripcion=$3, precio=$4, imagen=$5
      WHERE id=$6
    `;
    db.query(sql, [nombre, categoria, descripcion, precio, img, id], callback);
  },

  eliminar: (id, callback) => {
    const sql = "DELETE FROM productos WHERE id=$1";
    db.query(sql, [id], callback);
  },

  obtenerPorId: (id, callback) => {
    const sql = "SELECT * FROM productos WHERE id=$1";
    db.query(sql, [id], callback);
  }
};

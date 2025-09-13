const db = require('./db'); // tu conexión a la base de datos

module.exports = {
  listar: (callback) => {
    const sql = "SELECT * FROM productos";
    db.query(sql, callback);
  },

  crear: (producto, callback) => {
  const { nombre, categoria, descripcion, precio } = producto;
  
  // URL de emergencia si imagen está vacía
  let imagen = producto.imagen && producto.imagen.trim() !== '' 
      ? producto.imagen 
      : 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg';

  const sql = "INSERT INTO productos (nombre, categoria, descripcion, precio, imagen) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, categoria, descripcion, precio, imagen], callback);
},




  actualizar: (id, producto, callback) => {
  const { nombre, categoria, descripcion, precio, imagen } = producto;

  // URL de emergencia si imagen está vacía
  let img = imagen && imagen.trim() !== '' 
      ? imagen 
      : 'https://upload.wikimedia.org/wikipedia/commons/3/33/Chorizo_sausage.jpg';

  const sql = "UPDATE productos SET nombre=?, categoria=?, descripcion=?, precio=?, imagen=? WHERE id=?";
  db.query(sql, [nombre, categoria, descripcion, precio, img, id], callback);
},


  eliminar: (id, callback) => {
    const sql = "DELETE FROM productos WHERE id=?";
    db.query(sql, [id], callback);
  },
  obtenerPorId: (id, callback) => {
  const sql = "SELECT * FROM productos WHERE id = ?";
  db.query(sql, [id], callback);
}


};

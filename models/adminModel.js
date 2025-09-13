const db = require('./db');

module.exports = {
  crear: (data, callback) => {
    const sql = "INSERT INTO admins (nombre, correo, contrasena) VALUES (?, ?, ?)";
    db.query(sql, [data.nombre, data.correo, data.contrasena], callback);
  },

  obtenerPorCorreo: (correo, callback) => {
    const sql = "SELECT * FROM admins WHERE correo = ?";
    db.query(sql, [correo], callback);
  },

  obtenerPorId: (id, callback) => {
    const sql = "SELECT * FROM admins WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

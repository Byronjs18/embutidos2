const db = require('./db'); // Aquí debe ser tu Pool de pg

module.exports = {
  crear: (data, callback) => {
    const sql = `
      INSERT INTO admins (nombre, correo, contrasena)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    db.query(sql, [data.nombre, data.correo, data.contrasena], callback);
  },

  obtenerPorCorreo: (correo, callback) => {
    const sql = "SELECT * FROM admins WHERE correo = $1";
    db.query(sql, [correo], callback);
  },

  obtenerPorId: (id, callback) => {
    const sql = "SELECT * FROM admins WHERE id = $1";
    db.query(sql, [id], callback);
  }
};

const db = require('./db'); // conexión con 'pg' (node-postgres)

module.exports = {
  crearPedido: (pedido, callback) => {
    const {
      nombre_cliente,
      direccion,
      dpi,
      departamento,
      municipio,
      telefono,
      correo,
      productos,
      total,
      numero_transaccion
    } = pedido;

    const sql = `
      INSERT INTO pedidos 
      (nombre_cliente, direccion, dpi, departamento, municipio, telefono, correo, productos, total, numero_transaccion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;

    const values = [
      nombre_cliente,
      direccion,
      dpi,
      departamento,
      municipio,
      telefono,
      correo,
      productos,
      total,
      numero_transaccion
    ];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]);
    });
  },

  listarPedidos: (callback) => {
    const sql = `SELECT * FROM pedidos ORDER BY fecha DESC`;
    db.query(sql, (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows);
    });
  }
};

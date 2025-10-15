const pool = require('../models/db');
const bcrypt = require('bcrypt');

exports.login  = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE correo = $1', [correo]);

    if (result.rowCount === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const admin = result.rows[0];

    // Compara la contraseña con el hash
    const match = await bcrypt.compare(contrasena, admin.contrasena);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Guardar sesión
    req.session.adminId = admin.id;

    res.json({ mensaje: 'Login exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

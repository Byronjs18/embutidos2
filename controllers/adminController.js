const bcrypt = require('bcryptjs');
const adminModel = require('../models/adminModel');

module.exports = {
  crearAdmin: async (req, res) => {
    try {
      const { nombre, correo, contrasena } = req.body;
      const hash = bcrypt.hashSync(contrasena, 10);

      adminModel.crear({ nombre, correo, contrasena: hash }, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "Administrador creado", id: result.insertId });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginAdmin: (req, res) => {
  const { correo, contrasena } = req.body;

  adminModel.obtenerPorCorreo(correo, (err, admins) => {
    if (err) return res.status(500).json({ mensaje: "Error en la base de datos" });
    if (admins.length === 0) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    const admin = admins[0];
    if (!bcrypt.compareSync(contrasena, admin.contrasena)) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Guardar ID del admin en la sesión
    req.session.adminId = admin.id;

    res.json({ mensaje: "Login exitoso" });
  });
},



};

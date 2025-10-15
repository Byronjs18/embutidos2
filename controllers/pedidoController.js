const pedidoModel = require('../models/pedidoModel');

module.exports = {
  crearPedido: (req, res) => {
    const nuevoPedido = req.body;
    pedidoModel.crearPedido(nuevoPedido, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ mensaje: "Pedido guardado correctamente", id: result.insertId });
    });
  },

  listarPedidos: (req, res) => {
    pedidoModel.listarPedidos((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  }
};

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Registrar un pedido
router.post('/', pedidoController.crearPedido);

// Listar pedidos (opcional)
router.get('/', pedidoController.listarPedidos);

module.exports = router;

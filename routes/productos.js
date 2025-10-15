const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');


router.get('/', productosController.listarProductos);
router.get('/:id', productosController.obtenerProducto);
router.post('/crear', productosController.crearProducto);
router.put('/editar/:id', productosController.editarProducto);
router.delete('/eliminar/:id', productosController.eliminarProducto);


module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.loginAdmin);  // ✅ callback existe
router.post('/crear', adminController.crearAdmin);

module.exports = router;

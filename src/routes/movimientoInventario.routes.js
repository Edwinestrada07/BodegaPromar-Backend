/** Este archivo contiene las rutas para manejar las solicitudes relacionadas con los movimientos de inventario. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/movimientoInventario.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, controller.obtenerTodos);
router.get('/:id', authenticateToken, controller.obtenerPorId);

module.exports = router;
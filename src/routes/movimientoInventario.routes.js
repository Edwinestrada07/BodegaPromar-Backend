/** Este archivo contiene las rutas para manejar las solicitudes relacionadas con los movimientos de inventario. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/movimientoInventario.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);

module.exports = router;
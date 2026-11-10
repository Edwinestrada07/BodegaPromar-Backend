/** Rutas para consultar el inventario y registrar entradas de material. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventario.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/entrada', authenticateToken, controller.registrarEntrada);
router.post('/traslado', authenticateToken, controller.registrarTraslado);

module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../controllers/reserva.controller');
const {validarId, validarCrear, validarCantidad, validarConsumo} = require('../validators/reserva.validator');
const {authenticateToken} = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.get('/', controller.obtenerTodas);
router.get('/:id', validarId, controller.obtenerPorId);
router.post('/', validarCrear, controller.crear);
router.post('/:id/liberar', validarCantidad, controller.liberar);
router.post('/:id/cancelar', validarId, controller.cancelar);
router.post('/:id/consumir', validarConsumo, controller.consumir);

module.exports = router;

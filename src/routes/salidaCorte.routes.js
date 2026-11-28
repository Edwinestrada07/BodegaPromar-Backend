const express = require('express');
const router = express.Router();

const controller = require('../controllers/salidaCorte.controller');
const {
    validarIdSalida,
    validarSalida,
    validarRetorno,
} = require('../validators/salidaCorte.validator');
const {
    authenticateToken,
} = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.get(
    '/:movimientoSalidaId',
    validarIdSalida,
    controller.obtenerPorId
);
router.post('/', validarSalida, controller.registrarSalida);
router.post(
    '/:movimientoSalidaId/retornos',
    validarRetorno,
    controller.registrarRetornoCompleto
);

module.exports = router;

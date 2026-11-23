/** Rutas para manejar los ajustes de inventario, tanto positivos como negativos. */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/ajusteInventario.controller');
const {validarDatosPositivo, validarDatosNegativo} = require('../validators/ajusteInventario.validator');
const {authenticateToken} = require('../middlewares/auth.middleware');

router.post('/positivo', authenticateToken, validarDatosPositivo, controller.ajustarPositivo);
router.post('/negativo', authenticateToken, validarDatosNegativo, controller.ajustarNegativo);

module.exports = router;

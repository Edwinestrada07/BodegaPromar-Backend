/** Rutas para manejar las solicitudes relacionadas con los estantes. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/estante.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, controller.obtenerTodas);
router.get('/:id', authenticateToken, controller.obtenerPorId);
router.post('/', authenticateToken, controller.crear);
router.put('/:id', authenticateToken, controller.actualizar);

module.exports = router;
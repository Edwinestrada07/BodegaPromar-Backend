/** Rutas para manejar las solicitudes relacionadas con las zonas. **/

const express = require('express');
const router = express.Router();

const zonaController = require('../controllers/zona.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, zonaController.obtenerTodas);
router.get('/:id', authenticateToken, zonaController.obtenerPorId);
router.get('/:id/estructura', authenticateToken, zonaController.obtenerEstructura);
router.post('/', authenticateToken, zonaController.crear);
router.put('/:id', authenticateToken, zonaController.actualizar);

module.exports = router;
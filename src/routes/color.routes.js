/** Rutas para manejar las operaciones relacionadas con los colores. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/color.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, controller.obtenerTodos);
router.get('/:id', authenticateToken, controller.obtenerPorId);
router.post('/', authenticateToken, controller.crear);
router.put('/:id', authenticateToken, controller.actualizar);

module.exports = router;

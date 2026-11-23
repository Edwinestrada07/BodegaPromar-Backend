/** Este archivo contiene las rutas para interactuar con la tabla "maquinas_corte" en la base de datos. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/maquinaCorte.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, controller.obtenerTodos);
router.get('/:id', authenticateToken, controller.obtenerPorId);
router.post('/', authenticateToken, controller.crear);
router.put('/:id', authenticateToken, controller.actualizar);

module.exports = router;
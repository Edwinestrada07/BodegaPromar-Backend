/** Rutas para manejar las operaciones relacionadas con los colores. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/color.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;

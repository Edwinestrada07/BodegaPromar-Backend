/** Rutas para manejar las operaciones relacionadas con las texturas. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/textura.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;

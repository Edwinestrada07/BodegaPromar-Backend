/** Rutas para manejar las operaciones relacionadas con los tipos de material. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/tipoMaterial.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;
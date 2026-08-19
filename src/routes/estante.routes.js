/** Rutas para manejar las solicitudes relacionadas con los estantes. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/estante.controller');

router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;
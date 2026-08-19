/** Rutas para manejar las solicitudes relacionadas con los niveles. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/nivel.controller');

router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;

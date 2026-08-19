/** Rutas para manejar las solicitudes relacionadas con las zonas. **/

const express = require('express');
const router = express.Router();

const zonaController = require('../controllers/zona.controller');

router.get('/', zonaController.obtenerTodas);
router.get('/:id', zonaController.obtenerPorId);
router.get('/:id/estructura', zonaController.obtenerEstructura);
router.post('/', zonaController.crear);
router.put('/:id', zonaController.actualizar);

module.exports = router;
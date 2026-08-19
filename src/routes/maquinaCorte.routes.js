/** Este archivo contiene las rutas para interactuar con la tabla "maquinas_corte" en la base de datos. **/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/maquinaCorte.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;
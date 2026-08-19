/** Este archivo contiene las rutas relacionadas con los materiales. Las rutas definen los
    endpoints de la API y especifican qué controlador manejará cada solicitud. 
**/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/material.controller');

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;
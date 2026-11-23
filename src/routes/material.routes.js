/** Este archivo contiene las rutas relacionadas con los materiales. Las rutas definen los
    endpoints de la API y especifican qué controlador manejará cada solicitud. 
**/

const express = require('express');
const router = express.Router();

const controller = require('../controllers/material.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, controller.obtenerTodos);
router.get('/:id', authenticateToken, controller.obtenerPorId);
router.post('/', authenticateToken, controller.crear);
router.put('/:id', authenticateToken, controller.actualizar);

module.exports = router;
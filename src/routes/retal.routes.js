const express = require('express');
const router = express.Router();

const controller = require('../controllers/retal.controller');
const {
    validarId,
    validarCrear,
} = require('../validators/retal.validator');
const {
    authenticateToken,
} = require('../middlewares/auth.middleware');

router.use(authenticateToken);

router.get('/', controller.obtenerTodos);
router.get('/:id', validarId, controller.obtenerPorId);
router.post('/', validarCrear, controller.crear);

module.exports = router;

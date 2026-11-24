const {body, param, validationResult} = require('express-validator');

const validarResultado = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Datos de reserva inválidos',
            errors: errores.array().map((error) => ({
                campo: error.path,
                mensaje: error.msg,
            })),
        });
    }

    return next();
};

const validarId = [
    param('id')
        .isUUID()
        .withMessage('id debe ser un UUID válido'),
    validarResultado,
];

const validarCrear = [
    body('material_id')
        .isUUID()
        .withMessage('material_id debe ser un UUID válido'),
    body('nivel_id')
        .isUUID()
        .withMessage('nivel_id debe ser un UUID válido'),
    body('cantidad')
        .isInt({ min: 1 })
        .withMessage('cantidad debe ser un entero mayor que cero')
        .toInt(),
    body('observacion')
        .optional()
        .isString()
        .withMessage('observacion debe ser texto'),
    validarResultado,
];

const validarCantidad = [
    ...validarId.slice(0, 1),
    body('cantidad')
        .isInt({ min: 1 })
        .withMessage('cantidad debe ser un entero mayor que cero')
        .toInt(),
    validarResultado,
];

const validarConsumo = [
    ...validarId.slice(0, 1),
    body('cantidad')
        .isInt({ min: 1 })
        .withMessage('cantidad debe ser un entero mayor que cero')
        .toInt(),
    body('maquina_corte_id')
        .isUUID()
        .withMessage('maquina_corte_id debe ser un UUID válido'),
    body('observacion')
        .optional()
        .isString()
        .withMessage('observacion debe ser texto'),
    validarResultado,
];

module.exports = {
    validarId,
    validarCrear,
    validarCantidad,
    validarConsumo,
};

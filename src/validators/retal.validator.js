const {
    body,
    param,
    validationResult,
} = require('express-validator');

const validarResultado = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Datos del retal inválidos',
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
    body('movimiento_salida_id')
        .isUUID()
        .withMessage('movimiento_salida_id debe ser un UUID válido'),
    body('nivel_id')
        .isUUID()
        .withMessage('nivel_id debe ser un UUID válido'),
    body('largo_mm')
        .isInt({ min: 1, max: 2147483647 })
        .withMessage('largo_mm debe ser un entero positivo')
        .toInt(),
    body('ancho_mm')
        .isInt({ min: 1, max: 2147483647 })
        .withMessage('ancho_mm debe ser un entero positivo')
        .toInt(),
    body('cantidad')
        .isInt({ min: 1, max: 2147483647 })
        .withMessage('cantidad debe ser un entero positivo')
        .toInt(),
    body('estado')
        .optional()
        .isIn(['REUTILIZABLE', 'DAÑADO'])
        .withMessage('estado debe ser REUTILIZABLE o DAÑADO'),
    body('observacion')
        .optional()
        .isString()
        .withMessage('observacion debe ser texto'),
    validarResultado,
];

module.exports = {
    validarId,
    validarCrear,
};

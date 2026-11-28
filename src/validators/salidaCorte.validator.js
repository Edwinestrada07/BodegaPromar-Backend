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
            message: 'Datos de salida o retorno inválidos',
            errors: errores.array().map((error) => ({
                campo: error.path,
                mensaje: error.msg,
            })),
        });
    }

    return next();
};

const validarSalida = [
    body('material_id')
        .isUUID()
        .withMessage('material_id debe ser un UUID válido'),
    body('nivel_origen_id')
        .isUUID()
        .withMessage('nivel_origen_id debe ser un UUID válido'),
    body('maquina_corte_id')
        .isUUID()
        .withMessage('maquina_corte_id debe ser un UUID válido'),
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

const validarRetorno = [
    param('movimientoSalidaId')
        .isUUID()
        .withMessage('movimientoSalidaId debe ser un UUID válido'),
    body('nivel_destino_id')
        .isUUID()
        .withMessage('nivel_destino_id debe ser un UUID válido'),
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

const validarIdSalida = [
    param('movimientoSalidaId')
        .isUUID()
        .withMessage('movimientoSalidaId debe ser un UUID válido'),
    validarResultado,
];

module.exports = {
    validarIdSalida,
    validarSalida,
    validarRetorno,
};

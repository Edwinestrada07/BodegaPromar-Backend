/** Validador para los datos de ajuste de inventario, tanto positivos como negativos.
    Este módulo utiliza `express-validator` para definir reglas de validación y manejar los errores de validación.
    Se exportan dos conjuntos de validaciones: `validarDatosPositivo` y `validarDatosNegativo`, que se aplican a las rutas correspondientes.
 */

const { body, validationResult } = require('express-validator');

const validarResultado = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Datos de ajuste inválidos',
            errors: errores.array().map((error) => ({
                campo: error.path,
                mensaje: error.msg,
            })),
        });
    }

    return next();
};

const validarDatosPositivo = [
    body('material_id')
        .isUUID()
        .withMessage('material_id debe ser un UUID válido'),
    body('nivel_destino_id')
        .isUUID()
        .withMessage('nivel_destino_id debe ser un UUID válido'),
    body('cantidad')
        .isInt({ min: 1 })
        .withMessage('cantidad debe ser un entero mayor que cero')
        .toInt(),
    validarResultado,
];

const validarDatosNegativo = [
    body('material_id')
        .isUUID()
        .withMessage('material_id debe ser un UUID válido'),
    body('nivel_origen_id')
        .isUUID()
        .withMessage('nivel_origen_id debe ser un UUID válido'),
    body('cantidad')
        .isInt({ min: 1 })
        .withMessage('cantidad debe ser un entero mayor que cero')
        .toInt(),
    validarResultado,
];

module.exports = {
    validarDatosPositivo,
    validarDatosNegativo,
};

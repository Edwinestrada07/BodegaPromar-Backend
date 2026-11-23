/** Controller para manejar los ajustes de inventario, tanto positivos como negativos. 
 *  Este módulo expone dos funciones principales: `ajustarPositivo` y `ajustarNegativo`, 
 *  que se encargan de procesar las solicitudes de ajuste de inventario y delegar la lógica de 
 * negocio al servicio correspondiente.
 */

const service = require('../services/ajusteInventario.service');

const ajustarPositivo = async (req, res) => {
    try {
        const resultado = await service.ajustarPositivo(
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Ajuste positivo registrado correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error(
            'Error al registrar ajuste positivo:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const ajustarNegativo = async (req, res) => {
    try {
        const resultado = await service.ajustarNegativo(
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Ajuste negativo registrado correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error(
            'Error al registrar ajuste negativo:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    ajustarPositivo,
    ajustarNegativo,
};

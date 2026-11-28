const service = require('../services/salidaCorte.service');

const obtenerPorId = async (req, res) => {
    try {
        const salida = await service.obtenerPorId(
            req.params.movimientoSalidaId
        );

        return res.status(200).json({
            success: true,
            data: salida,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const registrarSalida = async (req, res) => {
    try {
        const resultado = await service.registrarSalida(
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Salida hacia corte registrada correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error('Error al registrar salida hacia corte:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const registrarRetornoCompleto = async (req, res) => {
    try {
        const resultado = await service.registrarRetornoCompleto(
            req.params.movimientoSalidaId,
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Retorno de planchas completas registrado correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error('Error al registrar retorno desde corte:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    obtenerPorId,
    registrarSalida,
    registrarRetornoCompleto,
};

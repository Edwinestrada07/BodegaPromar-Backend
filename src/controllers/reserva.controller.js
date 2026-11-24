const service = require('../services/reserva.service');

const obtenerTodas = async (req, res) => {
    try {
        const reservas = await service.obtenerTodas();

        return res.status(200).json({
            success: true,
            data: reservas,
        });
    } catch (error) {
        console.error('Error al consultar reservas:', error);

        return res.status(500).json({
            success: false,
            message: 'No fue posible consultar las reservas',
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const reserva = await service.obtenerPorId(req.params.id);

        return res.status(200).json({
            success: true,
            data: reserva,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const crear = async (req, res) => {
    try {
        const resultado = await service.crear(
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Reserva creada correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const liberar = async (req, res) => {
    try {
        const reserva = await service.liberar(
            req.params.id,
            req.body.cantidad
        );

        return res.status(200).json({
            success: true,
            message: 'Unidades liberadas correctamente',
            data: reserva,
        });
    } catch (error) {
        console.error('Error al liberar reserva:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const cancelar = async (req, res) => {
    try {
        const reserva = await service.cancelar(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Reserva cancelada correctamente',
            data: reserva,
        });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const consumir = async (req, res) => {
    try {
        const resultado = await service.consumir(
            req.params.id,
            req.body,
            req.usuario?.id || null
        );

        return res.status(200).json({
            success: true,
            message: 'Unidades enviadas a corte correctamente',
            data: resultado,
        });
    } catch (error) {
        console.error('Error al consumir reserva:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    liberar,
    cancelar,
    consumir,
};

const service = require('../services/retal.service');

const obtenerTodos = async (req, res) => {
    try {
        const retales = await service.obtenerTodos();

        return res.status(200).json({
            success: true,
            data: retales,
        });
    } catch (error) {
        console.error('Error al consultar retales:', error);

        return res.status(500).json({
            success: false,
            message: 'No fue posible consultar los retales',
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const retal = await service.obtenerPorId(req.params.id);

        return res.status(200).json({
            success: true,
            data: retal,
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
        const retal = await service.crear(
            req.body,
            req.usuario?.id || null
        );

        return res.status(201).json({
            success: true,
            message: 'Retal registrado correctamente',
            data: retal,
        });
    } catch (error) {
        console.error('Error al registrar retal:', error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
};

/** Controlador para manejar las solicitudes relacionadas con los movimientos de inventario. **/

const service = require('../services/movimientoInventario.service');

/** Controlador para manejar las solicitudes relacionadas con los movimientos de inventario. **/
const obtenerTodos = async (req, res) => {
    try {

        const movimientos = await service.obtenerTodos();

        res.status(200).json({
            success: true,
            data: movimientos,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Controlador para obtener un registro de movimiento de inventario por su ID. **/
const obtenerPorId = async (req, res) => {
    try {
        const movimiento = await service.obtenerPorId(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: movimiento,
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message,

        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
};
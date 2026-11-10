/** Controlador para gestionar las operaciones relacionadas con el inventario. este archivo contiene funciones que 
    permiten obtener todos los registros de inventario, obtener un registro específico por su ID y registrar la entrada 
    de material en el inventario.
**/

const service = require('../services/inventario.service');

const obtenerTodos = async (req, res) => {
    try {
        const inventarios = await service.obtenerTodos();

        return res.status(200).json({
            success: true,
            data: inventarios
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const inventario = await service.obtenerPorId(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: inventario
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const registrarEntrada = async (req, res) => {

    try {

        const resultado =
            await service.registrarEntrada(
                req.body,
                req.usuario?.id || null
            );

        return res.status(201).json({
            success: true,
            message: 'Entrada de material registrada correctamente',
            data: resultado
        });

    } catch (error) {

        console.error(
            'Error al registrar entrada:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const registrarTraslado = async (req, res) => {

    try {

        const resultado =
            await service.registrarTraslado(
                req.body,
                req.usuario?.id || null
            );

        return res.status(200).json({
            success: true,
            message: 'Traslado de material registrado correctamente',
            data: resultado
        });

    } catch (error) {

        console.error(
            'Error al registrar traslado:',
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    registrarEntrada,
    registrarTraslado
};
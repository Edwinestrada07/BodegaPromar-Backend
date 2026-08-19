/** Controlador para manejar las operaciones relacionadas con las texturas. **/

const service = require('../services/textura.service');

/* Obtiene todas las texturas de la base de datos. **/
const obtenerTodos = async (req, res) => {
    try {
        const texturas = await service.obtenerTodos();
        res.status(200).json({
            success: true,
            data: texturas,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* Obtiene una textura por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
    try {
        const textura = await service.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: textura,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/* Crea una nueva textura en la base de datos. **/
const crear = async (req, res) => {
    try {
        const textura = await service.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Textura creada correctamente',
            data: textura,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* Actualiza una textura existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const textura = await service.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Textura actualizada correctamente',
            data: textura,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
};

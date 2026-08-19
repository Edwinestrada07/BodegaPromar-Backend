/** Controlador para manejar las operaciones relacionadas con los colores. **/

const service = require('../services/color.service');

/* Obtiene todos los colores de la base de datos. **/
const obtenerTodos = async (req, res) => {
    try {
        const colores = await service.obtenerTodos();
        res.status(200).json({
            success: true,
            data: colores,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* Obtiene un color por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
    try {
        const color = await service.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: color,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/* Crea un nuevo color en la base de datos. **/
const crear = async (req, res) => {
    try {
        const color = await service.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Color creado correctamente',
            data: color,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* Actualiza un color existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const color = await service.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Color actualizado correctamente',
            data: color,
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

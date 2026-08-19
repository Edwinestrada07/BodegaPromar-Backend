/** Controlador para manejar las operaciones relacionadas con los tipos de material. **/

const service = require('../services/tipoMaterial.service');


/** Obtiene todos los tipos de material de la base de datos. **/
const obtenerTodos = async (req, res) => {
    try {
        const tipos = await service.obtenerTodos();
        res.status(200).json({
            success: true,
            data: tipos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene un tipo de material por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
    try {
        const tipo = await service.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: tipo,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Crea un nuevo tipo de material en la base de datos. **/
const crear = async (req, res) => {
    try {
        const tipo = await service.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Tipo de material creado correctamente',
            data: tipo,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/** Actualiza un tipo de material existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const tipo = await service.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Tipo de material actualizado correctamente',
            data: tipo,
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
/** Controlador para manejar las solicitudes HTTP relacionadas con los estantes. **/

const estanteService = require('../services/estante.service');

/** Obtiene todos los estantes de la base de datos. **/
const obtenerTodas = async (req, res) => {
    try {
        const estantes = await estanteService.obtenerTodas();
        res.status(200).json({
            success: true,
            data: estantes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene un estante por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
    try {
        const estante = await estanteService.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: estante,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Crea un nuevo estante en la base de datos. **/
const crear = async (req, res) => {
    try {
        const estante = await estanteService.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Estante creado correctamente',
            data: estante,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/** Actualiza un estante existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const estante = await estanteService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Estante actualizado correctamente',
            data: estante,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
};
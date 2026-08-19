/** Controlador para manejar las solicitudes relacionadas con las zonas. Este controlador interactúa con el 
    servicio de zonas para realizar operaciones como obtener todas las zonas, obtener una zona por su ID, crear 
    una nueva zona y actualizar una zona existente.
**/

const zonaService = require('../services/zona.service');

/** Obtiene todas las zonas de la base de datos. **/
const obtenerTodas = async (req, res) => {
    try {
        const zonas = await zonaService.obtenerTodas();

        res.status(200).json({
            success: true,
            data: zonas,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene una zona por su ID. **/
const obtenerPorId = async (req, res) => {
    try {
        const zona = await zonaService.obtenerPorId(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: zona,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene la estructura anidada de una zona. **/
const obtenerEstructura = async (req, res) => {
    try {
        const zona = await zonaService.obtenerEstructura(req.params.id);
        res.status(200).json({
            success: true,
            data: zona,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Crea una nueva zona en la base de datos. **/
const crear = async (req, res) => {
    try {
        const zona = await zonaService.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Zona creada correctamente',
            data: zona,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/** Actualiza una zona existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const zona = await zonaService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Zona actualizada correctamente',
            data: zona,
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
    obtenerEstructura,
    crear,
    actualizar,
};
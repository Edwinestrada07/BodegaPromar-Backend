/** Este archivo contiene los controladores para manejar las solicitudes relacionadas con los 
    materiales. Los controladores se encargan de recibir las solicitudes HTTP, procesarlas y 
    enviar las respuestas
**/

const materialService = require('../services/material.service');

/** Obtiene todos los materiales de la base de datos. **/
const obtenerTodos = async (req, res) => {
    try {
        const materiales = await materialService.obtenerTodos();
        res.status(200).json({
            success: true,
            data: materiales,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene un material por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
    try {
        const material = await materialService.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: material,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Crea un nuevo material en la base de datos. **/
const crear = async (req, res) => {
    try {
        const material = await materialService.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Material creado correctamente',
            data: material,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/** Actualiza un material existente en la base de datos. **/
const actualizar = async (req, res) => {
    try {
        const material = await materialService.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Material actualizado correctamente',
            data: material,
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
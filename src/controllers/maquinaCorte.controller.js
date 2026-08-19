/** Este archivo contiene las funciones del controlador para interactuar con la tabla "maquinas_corte" en 
    la base de datos.
    Estas funciones permiten realizar operaciones de consulta, creación y actualización de registros en la tabla 
    "maquinas_corte", facilitando la gestión de las máquinas de corte disponibles en el sistema.
**/

const service = require('../services/maquinaCorte.service');

/** Obtiene todos los registros de máquinas de corte de la base de datos **/
const obtenerTodos = async (req, res) => {
    try {
        const maquinas = await service.obtenerTodos();
        res.status(200).json({
            success: true,
            data: maquinas,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/** Obtiene un registro de máquina de corte por su ID de la base de datos **/
const obtenerPorId = async (req, res) => {
    try {
        const maquina = await service.obtenerPorId(req.params.id);
        res.status(200).json({
            success: true,
            data: maquina,
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

/** Crea un nuevo registro de máquina de corte en la base de datos **/
const crear = async (req, res) => {
    try {
        const maquina = await service.crear(req.body);
        res.status(201).json({
            success: true,
            message: 'Máquina de corte creada correctamente',
            data: maquina,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/** Actualiza un registro de máquina de corte en la base de datos **/
const actualizar = async (req, res) => {
    try {
        const maquina = await service.actualizar(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Máquina de corte actualizada correctamente',
            data: maquina,
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
/** Este archivo contiene las funciones del repositorio para interactuar con la tabla "maquinas_corte" en la base de datos.
    Estas funciones permiten realizar operaciones de consulta, creación y actualización de registros en la tabla 
    "maquinas_corte", facilitando la gestión de las máquinas de corte disponibles en el sistema.
**/

const {MaquinaCorte} = require('../models');

/** Obtiene todos los registros de máquinas de corte de la base de datos **/
const findAll = async () => {
    return await MaquinaCorte.findAll({
        order: [
            ['codigo', 'ASC'],
        ],

    });

};

/** Obtiene un registro de máquina de corte por su ID de la base de datos **/
const findById = async (id) => {
    return await MaquinaCorte.findByPk(id);

};

/** Obtiene un registro de máquina de corte por su código de la base de datos **/
const findByCodigo = async (codigo) => {
    return await MaquinaCorte.findOne({
        where: {
            codigo,
        },

    });

};

/** Obtiene un registro de máquina de corte por su nombre de la base de datos **/
const findByNombre = async (nombre) => {
    return await MaquinaCorte.findOne({
        where: {
            nombre,
        },

    });

};

/** Crea un nuevo registro de máquina de corte en la base de datos **/
const create = async (data) => {
    return await MaquinaCorte.create(data);

};

/** Actualiza un registro de máquina de corte en la base de datos **/
const update = async (id, data) => {
    const maquina = await MaquinaCorte.findByPk(id);

    if (!maquina) {
        return null;
    }

    await maquina.update(data);
    return maquina;

};

module.exports = {
    findAll,
    findById,
    findByCodigo,
    findByNombre,
    create,
    update,
};
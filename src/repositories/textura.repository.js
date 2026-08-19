/** Este archivo contiene las funciones de acceso a datos para el modelo "Textura". **/

const { Textura } = require('../models');

/** Busca todos las texturas en la base de datos. **/
const findAll = async () => {
    return await Textura.findAll({
        order: [
            ['nombre', 'ASC'],
        ],
    });
};

/* Busca una textura por su ID en la base de datos. **/
const findById = async (id) => {
    return await Textura.findByPk(id);
};

/* Busca una textura por su código en la base de datos. **/
const findByCodigo = async (codigo) => {
    return await Textura.findOne({
        where: { codigo },
    });
};

/* Busca una textura por su nombre en la base de datos. **/
const findByNombre = async (nombre) => {
    return await Textura.findOne({
        where: { nombre },
    });
};

/* Crea una nueva textura en la base de datos. **/
const create = async (data) => {
    return await Textura.create(data);
};

/* Actualiza una textura existente en la base de datos. **/
const update = async (id, data) => {
    const textura = await Textura.findByPk(id);

    if (!textura) {
        return null;
    }

    await textura.update(data);
    return textura;
};

module.exports = {
    findAll,
    findById,
    findByCodigo,
    findByNombre,
    create,
    update,
};

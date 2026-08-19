/** Este archivo contiene las funciones de acceso a datos para el modelo "Color". **/

const { Color } = require('../models');

/** Busca todos los colores en la base de datos. **/
const findAll = async () => {
    return await Color.findAll({
        order: [
            ['nombre', 'ASC'],
        ],
    });
};

/* Busca un color por su ID en la base de datos. **/
const findById = async (id) => {
    return await Color.findByPk(id);
};

/* Busca un color por su código en la base de datos. **/
const findByCodigo = async (codigo) => {
    return await Color.findOne({
        where: { codigo },
    });
};

/* Busca un color por su nombre en la base de datos. **/
const findByNombre = async (nombre) => {
    return await Color.findOne({
        where: { nombre },
    });
};

/* Crea un nuevo color en la base de datos. **/
const create = async (data) => {
    return await Color.create(data);
};

/* Actualiza un color existente en la base de datos. **/
const update = async (id, data) => {
    const color = await Color.findByPk(id);

    if (!color) {
        return null;
    }

    await color.update(data);
    return color;
};

module.exports = {
    findAll,
    findById,
    findByCodigo,
    findByNombre,
    create,
    update,
};

/** Repositorio para manejar las operaciones relacionadas con los niveles en la base de datos. **/

const { Nivel, Estante } = require('../models');

/** Busca todos los niveles en la base de datos. **/
const findAll = async () => {
    return await Nivel.findAll({
        include: [
            {
                model: Estante,
                as: 'estante',
                attributes: [
                    'id',
                    'codigo',
                    'nombre',
                ],
            },
        ],
        order: [
            ['numero', 'ASC'],
        ],
    });
};

/** Busca un nivel por su ID en la base de datos. **/
const findById = async (id) => {
    return await Nivel.findByPk(id, {
        include: [
            {
                model: Estante,
                as: 'estante',
            },
        ],
    });
};

/** Busca un nivel por su número y el ID del estante en la base de datos. **/
const findByNumeroAndEstante = async (numero, estante_id) => {
    return await Nivel.findOne({
        where: {
            numero,
            estante_id,
        },
    });
};

/** Crea un nuevo nivel en la base de datos. **/
const create = async (data) => {
    return await Nivel.create(data);
};

/** Actualiza un nivel existente en la base de datos. **/
const update = async (id, data) => {
    const nivel =
        await Nivel.findByPk(id);

    if (!nivel) {
        return null;
    }

    await nivel.update(data);

    return nivel;
};

module.exports = {
    findAll,
    findById,
    findByNumeroAndEstante,
    create,
    update,
};
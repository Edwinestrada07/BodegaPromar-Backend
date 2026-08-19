/** Este archivo es un repositorio que contiene funciones para interactuar con la tabla de zonas en la base 
    de datos. 
**/

const { Zona, Estante, Nivel } = require('../models');

/** Busca todas las zonas en la base de datos. **/
const findAll = async () => {
    return await Zona.findAll({
        include: [
            {
                model: Estante,
                as: 'estantes',
                attributes: ['id', 'codigo', 'nombre', 'estado'],
            },
        ],
        order: [
            ['nombre', 'ASC'],
        ],
    });
};

/** Busca una zona por su ID en la base de datos. **/
const findById = async (id) => {
    return await Zona.findByPk(id, {
        include: [
            {
                model: Estante,
                as: 'estantes',
                attributes: ['id', 'codigo', 'nombre', 'estado'],
            },
        ],
    });
};

/** Busca una zona por su ID en la base de datos, incluyendo su estructura anidada de estantes 
    y niveles. **/
const findByIdWithEstructura = async (id) => {
    return await Zona.findByPk(id, {
        attributes: ['id', 'codigo', 'nombre'],
        include: [
            {
                model: Estante,
                as: 'estantes',
                attributes: ['id', 'codigo', 'nombre'],
                include: [
                    {
                        model: Nivel,
                        as: 'niveles',
                        attributes: ['id', 'codigo', 'numero'],
                    },
                ],
            },
        ],
        order: [
            ['codigo', 'ASC'],
            [{ model: Estante, as: 'estantes' }, 'codigo', 'ASC'],
            [{ model: Estante, as: 'estantes' }, { model: Nivel, as: 'niveles' }, 'numero', 'ASC'],
        ],
    });
};

/** Busca una zona por su código en la base de datos. **/
const findByCodigo = async (codigo) => {
    return await Zona.findOne({
        where: { codigo },
    });
};

/** Crea una nueva zona en la base de datos. **/
const create = async (data) => {
    return await Zona.create(data);
};

/** Actualiza una zona existente en la base de datos. **/
const update = async (id, data) => {
    const zona = await Zona.findByPk(id);

    if (!zona) {
        return null;
    }

    await zona.update(data);
    return zona;
};

module.exports = {
    findAll,
    findById,
    findByIdWithEstructura,
    findByCodigo,
    create,
    update,
};
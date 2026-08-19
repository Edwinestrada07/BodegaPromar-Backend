/** Repositorio para manejar las operaciones de la base de datos relacionadas con los estantes. **/

const { Estante, Zona, Nivel } = require('../models');

/** Busca todos los estantes en la base de datos. **/
const findAll = async () => {
    return await Estante.findAll({
        include: [
            {
                model: Zona,
                as: 'zona',
                attributes: [
                    'id',
                    'codigo',
                    'nombre',
                    'descripcion',
                ],
            },
            {
                model: Nivel,
                as: 'niveles',
                attributes: [
                    'id',
                    'numero',
                    'codigo',
                    'estado',
                    'descripcion',
                ],
            },
        ],
        order: [
            ['codigo', 'ASC'],
        ],
    });
};

/** Busca un estante por su ID en la base de datos. **/
const findById = async (id) => {
    return await Estante.findByPk(id, {
        include: [
            {
                model: Zona,
                as: 'zona',
            },
            {
                model: Nivel,
                as: 'niveles',
            },
        ],
    });
};

/** Busca un estante por su código y zona en la base de datos. **/
const findByCodigoAndZona = async (codigo, zona_id) => {
    return await Estante.findOne({
        where: {
            codigo,
            zona_id,
        },
    });
};

/** Crea un nuevo estante en la base de datos. **/
const create = async (data) => {
    return await Estante.create(data);
};

/** Actualiza un estante existente en la base de datos. **/
const update = async (id, data) => {
    const estante =
        await Estante.findByPk(id);

    if (!estante) {
        return null;
    }

    await estante.update(data);
    return estante;
};

module.exports = {
    findAll,
    findById,
    findByCodigoAndZona,
    create,
    update,
};
/** Este archivo contiene las funciones de acceso a datos para el modelo "TipoMaterial". Estas funciones 
    permiten realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la tabla "tipos_material" 
    de la base de datos. 
**/

const { TipoMaterial } = require('../models');

/** Busca todos los tipos de material en la base de datos. **/
const findAll = async () => {
    return await TipoMaterial.findAll({
        order: [
            ['nombre', 'ASC'],
        ],
    });
};

/** Busca un tipo de material por su ID en la base de datos. **/
const findById = async (id) => {
    return await TipoMaterial.findByPk(id);
};

/** Busca un tipo de material por su código en la base de datos. **/
const findByCodigo = async (codigo) => {
    return await TipoMaterial.findOne({
        where: { codigo },
    });
};

/** Busca un tipo de material por su nombre en la base de datos. **/
const findByNombre = async (nombre) => {
    return await TipoMaterial.findOne({
        where: { nombre },
    });
};

/** Crea un nuevo tipo de material en la base de datos. **/
const create = async (data) => {
    return await TipoMaterial.create(data);
};

/** Actualiza un tipo de material existente en la base de datos. **/
const update = async (id, data) => {
    const tipo =
        await TipoMaterial.findByPk(id);

    if (!tipo) {
        return null;
    }

    await tipo.update(data);
    return tipo;
};

module.exports = {
    findAll,
    findById,
    findByCodigo,
    findByNombre,
    create,
    update,
};
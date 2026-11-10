/** Este archivo contiene las funciones del repositorio para interactuar con la tabla "inventarios" en la base de datos.
    Estas funciones permiten realizar operaciones de consulta, creación y actualización de registros en la tabla 
    "inventarios", facilitando la gestión de los inventarios disponibles en el sistema.
**/

const {Inventario, Material, Nivel, TipoMaterial, Color, Textura, Estante, Zona} = require('../models');

const includeRelaciones = [
    {
        model: Material,
        as: 'material',
        include: [
            {
                model: TipoMaterial,
                as: 'tipoMaterial'
            },
            {
                model: Color,
                as: 'color'
            },
            {
                model: Textura,
                as: 'textura'
            }
        ]
    },
    {
        model: Nivel,
        as: 'nivel',
        include: [
            {
                model: Estante,
                as: 'estante',
                include: [
                    {
                        model: Zona,
                        as: 'zona'
                    }
                ]
            }
        ]
    }
];

const obtenerTodos = async () => {
    return await Inventario.findAll({
        include: includeRelaciones,
        order: [
            ['created_at', 'DESC']
        ]
    });
};

const obtenerPorMaterialYNivel = async (
    material_id,
    nivel_id,
    transaction
) => {

    return await Inventario.findOne({
        where: {
            material_id,
            nivel_id
        },
        transaction,
        lock: transaction.LOCK.UPDATE
    });

};

const obtenerPorId = async (id, transaction) => {

    return await Inventario.findByPk(id, {
        include: includeRelaciones,
        transaction
    });

};

const crear = async (data, transaction) => {

    return await Inventario.create(data, {
        transaction
    });

};

const actualizar = async (
    inventario,
    data,
    transaction
) => {

    await inventario.update(data, {
        transaction
    });

    return inventario;

};

const obtenerMaterial = async (id, transaction) => {

    return await Material.findByPk(id, {
        transaction
    });

};

const obtenerNivel = async (id, transaction) => {

    return await Nivel.findByPk(id, {
        transaction
    });

};

module.exports = {
    obtenerTodos,
    obtenerPorMaterialYNivel,
    obtenerPorId,
    crear,
    actualizar,
    obtenerMaterial,
    obtenerNivel
};
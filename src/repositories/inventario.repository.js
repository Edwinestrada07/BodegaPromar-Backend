/** Este archivo contiene las funciones del repositorio para interactuar con la tabla "inventarios" en la base de datos.
    Estas funciones permiten realizar operaciones de consulta, creación y actualización de registros en la tabla 
    "inventarios", facilitando la gestión de los inventarios disponibles en el sistema.
**/

const {Inventario, Material, TipoMaterial, Color, Textura, Nivel, Estante, Zona} = require('../models');

/* Incluye las relaciones con los catálogos de tipo de material, color y textura, ademas de las relaciones con los 
    niveles, estantes y zonas para obtener información adicional sobre los materiales. **/
const includeCompleto = [
    {
        model: Material,
        as: 'material',

        include: [
            {
                model: TipoMaterial,
                as: 'tipoMaterial',
            },
            {
                model: Color,
                as: 'color',
            },
            {
                model: Textura,
                as: 'textura',
            },
        ],
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
                        as: 'zona',
                    },
                ],
            },
        ],
    },
];

/** Obtiene todos los inventarios de la base de datos, incluyendo sus relaciones con los catálogos
    de tipo de material, color y textura, ademas de las relaciones con los niveles, estantes y zonas. **/
const findAll = async () => {
    return await Inventario.findAll({
        include: includeCompleto,
        order: [
            ['created_at', 'DESC'],
        ],
    });

};

/** Obtiene un inventario por su ID de la base de datos **/
const findById = async (id) => {
    return await Inventario.findByPk(
        id,
        {
            include: includeCompleto,
        }
    );

};

/** Obtiene un inventario por su ID de material y ID de nivel de la base de datos **/
const findByMaterialAndNivel = async (material_id, nivel_id) => {
    return await Inventario.findOne({
        where: {
            material_id,
            nivel_id,
        },
    });

};

/** Crea un nuevo inventario en la base de datos **/
const create = async (data) => {
    return await Inventario.create(data);

};

/** Actualiza un inventario existente en la base de datos **/
const update = async (id, data) => {

    const inventario = await Inventario.findByPk(id);

    if (!inventario) {
        return null;
    }

    await inventario.update(data);
    return inventario;

};

module.exports = {
    findAll,
    findById,
    findByMaterialAndNivel,
    create,
    update,
};
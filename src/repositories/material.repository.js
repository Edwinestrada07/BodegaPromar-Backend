/** Este archivo contiene el repositorio para la entidad "Material". Proporciona funciones para 
    interactuar con la base de datos y realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) 
    relacionadas con los materiales. Además, incluye las relaciones con las entidades "TipoMaterial",
    "Color" y "Textura" para obtener información adicional sobre los materiales. 
**/

const { Material, TipoMaterial, Color, Textura } = require('../models');

/* Incluye las relaciones con los catálogos de tipo de material, color y textura para obtener información adicional sobre 
    los materiales. **/
const includeCatalogos = [
    {
        model: TipoMaterial,
        as: 'tipoMaterial',
        attributes: [
            'id',
            'codigo',
            'nombre',
        ],
    },
    {
        model: Color,
        as: 'color',
        attributes: [
            'id',
            'codigo',
            'nombre',
        ],
    },
    {
        model: Textura,
        as: 'textura',
        attributes: [
            'id',
            'codigo',
            'nombre',
        ],
    },
];

/* Obtiene todos los materiales de la base de datos, incluyendo sus relaciones con los catálogos
   de tipo de material, color y textura. **/
const findAll = async () => {
    return await Material.findAll({
        include: includeCatalogos,
        order: [
            ['codigo', 'ASC'],
        ],
    });
};

/* Obtiene un material por su ID de la base de datos **/
const findById = async (id) => {
    return await Material.findByPk(
        id,
        {
            include: includeCatalogos,
        }
    );
};

/* Obtiene un material por su código de la base de datos **/
const findByCodigo = async (codigo) => {
    return await Material.findOne({
        where: {
            codigo,
        },
    });
};

/* Obtiene un material por sus características (tipo de material, color, textura y dimensiones) 
de la base de datos **/
const findByCaracteristicas = async (data) => {
    return await Material.findOne({
        where: {
            tipo_material_id:
                data.tipo_material_id,
            color_id:
                data.color_id,
            textura_id:
                data.textura_id,
            espesor_mm:
                data.espesor_mm,
            largo_mm:
                data.largo_mm,
            ancho_mm:
                data.ancho_mm,
        },
    });
};

/* Crea un nuevo material en la base de datos **/
const create = async (data) => {
    return await Material.create(data);
};

const update = async (id, data) => {
    const material =
        await Material.findByPk(id);

    if (!material) {
        return null;
    }

    await material.update(data);
    return material;

};

module.exports = {
    findAll,
    findById,
    findByCodigo,
    findByCaracteristicas,
    create,
    update,
};
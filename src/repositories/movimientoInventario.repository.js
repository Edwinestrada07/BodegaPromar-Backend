/** Este archivo contiene el repositorio para manejar las operaciones de la tabla movimientos_inventario 
    en la base de datos. Proporciona funciones para obtener todos los registros, obtener un registro por 
    ID y crear un nuevo registro. 
**/

const { MovimientoInventario, Material, MaquinaCorte, Nivel } = require('../models');

/** Repositorio para manejar las operaciones de la tabla movimientos_inventario en la base de datos.
    Proporciona funciones para obtener todos los registros, obtener un registro por ID y crear un nuevo registro.
**/
const findAll = async () => {
    return await MovimientoInventario.findAll({
        include: [

            {
                model: Material,
                as: 'material',
            },

            {
                model: MaquinaCorte,
                as: 'maquinaCorte',
            },

            {
                model: Nivel,
                as: 'nivelOrigen',
            },

            {
                model: Nivel,
                as: 'nivelDestino',
            },

        ],

        order: [
            ['created_at', 'DESC'],
        ],

    });

};

/** Función para obtener un registro de movimiento de inventario por su ID. **/
const findById = async (id) => {
    return await MovimientoInventario.findByPk(
        id,
        {

            include: [

                {
                    model: Material,
                    as: 'material',
                },

                {
                    model: MaquinaCorte,
                    as: 'maquinaCorte',
                },

                {
                    model: Nivel,
                    as: 'nivelOrigen',
                },

                {
                    model: Nivel,
                    as: 'nivelDestino',
                },

            ],

        }
    );

};

/** Función para crear un nuevo registro de movimiento de inventario. **/
const create = async (
    data,
    transaction = null
) => {

    return await MovimientoInventario.create(
        data,
        {
            transaction,
        }
    );

};

module.exports = {
    findAll,
    findById,
    create,
};
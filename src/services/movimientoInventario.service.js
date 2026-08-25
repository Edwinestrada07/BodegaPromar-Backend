/** Este archivo contiene el servicio para manejar las operaciones relacionadas con los movimientos de 
    inventario. **/

const repository = require('../repositories/movimientoInventario.repository');

/** Obtener todos los registros de movimientos de inventario. **/
const obtenerTodos = async () => {
    return await repository.findAll();
};

/** Obtener un registro de movimiento de inventario por su ID. **/
const obtenerPorId = async (id) => {
    const movimiento =
        await repository.findById(id);

    if (!movimiento) {

        throw new Error(
            'El movimiento de inventario no existe'
        );

    }
    return movimiento;
};

module.exports = {

    obtenerTodos,
    obtenerPorId,

};
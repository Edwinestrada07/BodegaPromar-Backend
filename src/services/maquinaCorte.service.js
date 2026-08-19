/** Este archivo contiene las funciones del servicio para interactuar con la tabla "maquinas_corte" en la base de datos.
    Estas funciones permiten realizar operaciones de consulta, creación y actualización de registros en la tabla 
    "maquinas_corte", facilitando la gestión de las máquinas de corte disponibles en el sistema.
**/

const repository = require('../repositories/maquinaCorte.repository');

/** Obtiene todos los registros de máquinas de corte de la base de datos **/
const obtenerTodos = async () => {
    return await repository.findAll();

};

/** Obtiene un registro de máquina de corte por su ID de la base de datos **/
const obtenerPorId = async (id) => {
    const maquina =
        await repository.findById(id);

    if (!maquina) {

        throw new Error(
            'La máquina de corte no existe'
        );

    }

    return maquina;

};

/** Crea un nuevo registro de máquina de corte en la base de datos **/
const crear = async (data) => {
    const {codigo, nombre} = data;

    if (!codigo || !nombre) {

        throw new Error(
            'El código y el nombre son obligatorios'
        );

    }

    const codigoExistente =
        await repository.findByCodigo(
            codigo
        );

    if (codigoExistente) {
        throw new Error(
            'Ya existe una máquina con ese código'
        );

    }

    const nombreExistente =
        await repository.findByNombre(
            nombre
        );

    if (nombreExistente) {
        throw new Error(
            'Ya existe una máquina con ese nombre'
        );

    }

    return await repository.create({
        codigo:
            codigo.toUpperCase(),
        nombre,
        descripcion:
            data.descripcion || null,
        estado:
            data.estado || 'ACTIVO',

    });

};

/** Actualiza un registro de máquina de corte en la base de datos **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return await repository.update(
        id,
        data
    );

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
};
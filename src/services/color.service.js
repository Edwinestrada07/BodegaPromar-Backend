/** Este archivo contiene las funciones de servicio para el modelo "Color". **/

const repository = require('../repositories/color.repository');

/* Obtiene todos los colores de la base de datos. **/
const obtenerTodos = async () => {
    return await repository.findAll();
};

/* Obtiene un color por su ID de la base de datos. **/
const obtenerPorId = async (id) => {
    const color = await repository.findById(id);

    if (!color) {
        throw new Error('El color no existe');
    }

    return color;
};

/* Crea un nuevo color en la base de datos. **/
const crear = async (data) => {
    const { codigo, nombre } = data;

    if (!codigo || !nombre) {
        throw new Error('El código y el nombre son obligatorios');
    }

    const codigoExistente = await repository.findByCodigo(codigo);

    if (codigoExistente) {
        throw new Error('Ya existe un color con ese código');
    }

    const nombreExistente = await repository.findByNombre(nombre);

    if (nombreExistente) {
        throw new Error('Ya existe un color con ese nombre');
    }

    return await repository.create({
        codigo: codigo.toUpperCase(),
        nombre,
        descripcion: data.descripcion || null,
        estado: data.estado || 'ACTIVO',
    });
};

/* Actualiza un color existente en la base de datos. **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return await repository.update(id, data);
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
};

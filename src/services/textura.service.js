/** Este archivo contiene las funciones de servicio para el modelo "Textura". **/

const repository = require('../repositories/textura.repository');

/* Obtiene todas las texturas de la base de datos. **/
const obtenerTodos = async () => {
    return await repository.findAll();
};

/* Obtiene una textura por su ID de la base de datos. **/
const obtenerPorId = async (id) => {
    const textura = await repository.findById(id);

    if (!textura) {
        throw new Error('La textura no existe');
    }

    return textura;
};

/* Crea una nueva textura en la base de datos. **/
const crear = async (data) => {
    const { codigo, nombre } = data;

    if (!codigo || !nombre) {
        throw new Error('El código y el nombre son obligatorios');
    }

    const codigoExistente = await repository.findByCodigo(codigo);

    if (codigoExistente) {
        throw new Error('Ya existe una textura con ese código');
    }

    const nombreExistente = await repository.findByNombre(nombre);

    if (nombreExistente) {
        throw new Error('Ya existe una textura con ese nombre');
    }

    return await repository.create({
        codigo: codigo.toUpperCase(),
        nombre,
        descripcion: data.descripcion || null,
        estado: data.estado || 'ACTIVO',
    });
};

/* Actualiza una textura existente en la base de datos. **/
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

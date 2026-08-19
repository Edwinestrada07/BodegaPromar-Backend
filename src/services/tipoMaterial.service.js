/** Este archivo contiene las funciones de servicio para el modelo "TipoMaterial". Estas funciones
    encapsulan la lógica de negocio y validaciones necesarias para interactuar con los datos de tipos 
    de material, utilizando las funciones del repositorio correspondiente.
**/

const repository = require('../repositories/tipoMaterial.repository');

/** Obtiene todos los tipos de material de la base de datos. **/
const obtenerTodos = async () => {
    return await repository.findAll();
};

/** Obtiene un tipo de material por su ID de la base de datos. Lanza un error si no existe. **/
const obtenerPorId = async (id) => {
    const tipo = await repository.findById(id);

    if (!tipo) {
        throw new Error(
            'El tipo de material no existe'
        );
    }

    return tipo;
};

/** Crea un nuevo tipo de material en la base de datos. Lanza un error si el código o el nombre ya existen. **/
const crear = async (data) => {
    const { codigo, nombre } = data;

    if (!codigo || !nombre) {
        throw new Error(
            'El código y el nombre son obligatorios'
        );
    }

    const codigoExistente = await repository.findByCodigo(codigo);

    if (codigoExistente) {
        throw new Error(
            'Ya existe un tipo de material con ese código'
        );
    }

    const nombreExistente = await repository.findByNombre(nombre);

    if (nombreExistente) {
        throw new Error(
            'Ya existe un tipo de material con ese nombre'
        );
    }

    return await repository.create({
        codigo: codigo.toUpperCase(),
        nombre,
        descripcion:
            data.descripcion || null,
        estado:
            data.estado || 'ACTIVO',
    });
};

/** Actualiza un tipo de material existente en la base de datos. Lanza un error si el tipo de material no existe,
    o si el nuevo código o nombre ya existen en otro tipo de material.
**/
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
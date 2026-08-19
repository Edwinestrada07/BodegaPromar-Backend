/** Servicio para manejar la lógica de negocio relacionada con las zonas. Este servicio interactúa con el 
    repositorio de zonas para realizar operaciones como obtener todas las zonas, obtener una zona por su ID, 
    crear una nueva zona y actualizar una zona existente.
**/

const zonaRepository = require('../repositories/zona.repository');

/** Obtiene todas las zonas de la base de datos. **/
const obtenerTodas = async () => {
    return await zonaRepository.findAll();
};

/** Obtiene una zona por su ID. **/
const obtenerPorId = async (id) => {
    const zona = await zonaRepository.findById(id);

    if (!zona) {
        throw new Error('La zona no existe');
    }

    return zona;
};

/** Obtiene la estructura anidada de una zona, incluyendo estantes y niveles. **/
const obtenerEstructura = async (id) => {
    const zona = await zonaRepository.findByIdWithEstructura(id);

    if (!zona) {
        throw new Error('La zona no existe');
    }

    return zona;
};

/** Crea una nueva zona en la base de datos. **/
const crear = async (data) => {
    const { codigo, nombre } = data;

    if (!codigo || !nombre) {
        throw new Error(
            'El código y el nombre de la zona son obligatorios'
        );
    }

    const zonaExistente = await zonaRepository.findByCodigo(codigo);

    if (zonaExistente) {
        throw new Error(
            'Ya existe una zona con ese código'
        );
    }

    return await zonaRepository.create({
        codigo,
        nombre,
        descripcion: data.descripcion || null,
        estado: data.estado || 'ACTIVA',
    });
};

/** Actualiza una zona existente en la base de datos. **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return await zonaRepository.update(id, data);
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    obtenerEstructura,
    crear,
    actualizar,
};
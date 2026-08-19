/** Servicio para manejar la lógica de negocio relacionada con los estantes. **/

const estanteRepository = require('../repositories/estante.repository');
const zonaRepository = require('../repositories/zona.repository');

/** Obtiene todos los estantes de la base de datos. **/
const obtenerTodas = async () => {
    return await estanteRepository.findAll();
};

/** Obtiene un estante por su ID de la base de datos. **/
const obtenerPorId = async (id) => {
    const estante = await estanteRepository.findById(id);

    if (!estante) {
        throw new Error(
            'El estante no existe'
        );
    }

    return estante;
};

/** Crea un nuevo estante en la base de datos. **/
const crear = async (data) => {
    const {zona_id, codigo, nombre } = data;

    if (!zona_id || !codigo || !nombre) {
        throw new Error(
            'zona_id, código y nombre son obligatorios'
        );
    }

    const zona = await zonaRepository.findById(zona_id);

    if (!zona) {
        throw new Error(
            'La zona especificada no existe'
        );
    }

    const existente =
        await estanteRepository
            .findByCodigoAndZona(
                codigo,
                zona_id
            );

    if (existente) {
        throw new Error(
            'Ya existe un estante con ese código en la zona'
        );
    }

    return await estanteRepository.create({
        zona_id,
        codigo,
        nombre,
        descripcion:
            data.descripcion || null,
        estado:
            data.estado || 'ACTIVO',
    });
};

/** Actualiza un estante existente en la base de datos. **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return await estanteRepository.update(
        id,
        data
    );
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
};
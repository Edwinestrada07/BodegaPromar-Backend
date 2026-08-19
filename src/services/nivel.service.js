/** Servicio para manejar la lógica de negocio relacionada con los niveles. Este servicio interactúa con el 
    repositorio de niveles para realizar operaciones como obtener todos los niveles, obtener un nivel por su ID, 
    crear un nuevo nivel y actualizar un nivel existente.
**/

const nivelRepository = require('../repositories/nivel.repository');
const estanteRepository = require('../repositories/estante.repository');

/** Obtiene todos los niveles de la base de datos. **/
const obtenerTodas = async () => {
    return await nivelRepository.findAll();
};

/** Obtiene un nivel por su ID de la base de datos. Lanza un error si el nivel no existe. **/
const obtenerPorId = async (id) => {
    const nivel = await nivelRepository.findById(id);

    if (!nivel) {
        throw new Error(
            'El nivel no existe'
        );
    }

    return nivel;
};

/** Crea un nuevo nivel en la base de datos. Lanza un error si el estante no existe o si ya existe un nivel con 
    el mismo número en el estante. **/
const crear = async (data) => {
    const { estante_id, numero, codigo } = data;

    if (!estante_id || !numero || !codigo) {
        throw new Error(
            'estante_id, número y código son obligatorios'
        );
    }

    const estante = await estanteRepository.findById(estante_id);

    if (!estante) {
        throw new Error(
            'El estante especificado no existe'
        );
    }

    const existente = await nivelRepository
            .findByNumeroAndEstante(
                numero,
                estante_id
            );

    if (existente) {
        throw new Error(
            'Ya existe ese nivel en el estante'
        );
    }

    return await nivelRepository.create({
        estante_id,
        numero,
        codigo,
        descripcion:
            data.descripcion || null,
        estado:
            data.estado || 'ACTIVO',
    });
};

/** Actualiza un nivel existente en la base de datos. Lanza un error si el nivel no existe, si el estante no 
 * existe o si ya existe un nivel con el mismo número en el estante. **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return await nivelRepository.update(
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
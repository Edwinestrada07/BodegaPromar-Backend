/** Este archivo contiene la lógica de negocio para la gestión de materiales. Proporciona funciones
    para obtener, crear y actualizar materiales, así como validar la existencia de tipos de 
    materiales, colores y texturas asociados.
**/

const materialRepository = require('../repositories/material.repository');
const tipoMaterialRepository = require('../repositories/tipoMaterial.repository');
const colorRepository = require('../repositories/color.repository');
const texturaRepository = require('../repositories/textura.repository');

/* Obtiene todos los materiales de la base de datos. **/
const obtenerTodos = async () => {
    return await materialRepository.findAll();
};

/* Obtiene un material por su ID de la base de datos. **/
const obtenerPorId = async (id) => {
    const material = await materialRepository.findById(id);
    if (!material) {
        throw new Error(
            'El material no existe'
        );
    }
    return material;
};

/* Crea un nuevo material en la base de datos. **/
const crear = async (data) => {
    const {
        tipo_material_id,
        color_id,
        textura_id,
        espesor_mm,
        largo_mm,
        ancho_mm,
    } = data;

    if (
        !tipo_material_id ||
        !color_id ||
        !textura_id ||
        !espesor_mm ||
        !largo_mm ||
        !ancho_mm
    ) {
        throw new Error(
            'Todos los datos del material son obligatorios'
        );
    }

    const tipo = await tipoMaterialRepository.findById(tipo_material_id);
    if (!tipo) {
        throw new Error(
            'El tipo de material no existe'
        );
    }

    const color = await colorRepository.findById(color_id);
    if (!color) {
        throw new Error(
            'El color no existe'
        );
    }

    const textura = await texturaRepository.findById(textura_id);
    if (!textura) {
        throw new Error(
            'La textura no existe'
        );
    }

    const existente = await materialRepository.findByCaracteristicas(data);
    if (existente) {
        throw new Error(
            'Ya existe un material con estas características'
        );
    }

    const ultimo = await materialRepository.findAll();
    const numero = ultimo.length + 1;
    const codigo = `MAT-${String(numero).padStart(6, '0')}`;

    return await materialRepository.create({
        codigo,
        tipo_material_id,
        color_id,
        textura_id,
        espesor_mm,
        largo_mm,
        ancho_mm,
        estado: 'ACTIVO',
    });
};

/* Actualiza un material existente en la base de datos. **/
const actualizar = async (id, data) => {
    await obtenerPorId(id);
    return await materialRepository.update(
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
/** Este archivo contiene la lógica de negocio relacionada con el inventario. Proporciona funciones para obtener todos 
    los registros de inventario, obtener un registro por su ID y registrar entradas de inventario.
    Estas funciones interactúan con el repositorio de inventario para realizar operaciones en la base de datos y aplicar 
    las reglas de negocio correspondientes.
**/

const inventarioRepository = require('../repositories/inventario.repository');
const materialRepository = require('../repositories/material.repository');
const nivelRepository = require('../repositories/nivel.repository');

/** Obtiene todos los registros de inventario de la base de datos **/
const obtenerTodos = async () => {
    return await inventarioRepository.findAll();

};

/** Obtiene un registro de inventario por su ID de la base de datos **/
const obtenerPorId = async (id) => {
    const inventario = await inventarioRepository.findById(id);

    if (!inventario) {

        throw new Error(
            'El registro de inventario no existe'
        );

    }

    return inventario;

};

/** Registra una entrada de inventario en la base de datos **/
const entrada = async (data) => {

    const {
        material_id,
        nivel_id,
        cantidad,
    } = data;

    if (
        !material_id ||
        !nivel_id ||
        !cantidad
    ) {

        throw new Error(
            'Material, nivel y cantidad son obligatorios'
        );

    }

    if (cantidad <= 0) {

        throw new Error(
            'La cantidad debe ser mayor que cero'
        );

    }

    const material =
        await materialRepository.findById(
            material_id
        );

    if (!material) {

        throw new Error(
            'El material no existe'
        );

    }

    const nivel =
        await nivelRepository.findById(
            nivel_id
        );

    if (!nivel) {

        throw new Error(
            'El nivel no existe'
        );

    }

    const inventario =
        await inventarioRepository
            .findByMaterialAndNivel(
                material_id,
                nivel_id
            );

    if (inventario) {

        inventario.cantidad += cantidad;

        await inventario.save();

        return inventario;

    }

    return await inventarioRepository.create({

        material_id,
        nivel_id,
        cantidad,
        cantidad_reservada: 0,
        estado: 'ACTIVO',

    });

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    entrada,
};
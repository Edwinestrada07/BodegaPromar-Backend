/** Repositorio para manejar las operaciones relacionadas con los ajustes de inventario. */

const {Inventario, Material, Nivel, MovimientoInventario, } = require('../models');

const obtenerMaterial = async (materialId, transaction) => {
    return await Material.findByPk(materialId, {
        transaction,
    });
};

const obtenerNivelConBloqueo = async (nivelId, transaction) => {
    return await Nivel.findByPk(nivelId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerInventarioConBloqueo = async (materialId, nivelId, transaction) => {
    return await Inventario.findOne({
        where: {
            material_id: materialId,
            nivel_id: nivelId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const crearInventario = async (data, transaction) => {
    return await Inventario.create(data, {
        transaction,
    });
};

const actualizarInventario = async (inventario, data, transaction) => {
    await inventario.update(data, {
        transaction,
    });

    return inventario;
};

const crearMovimiento = async (data, transaction) => {
    return await MovimientoInventario.create(data, {
        transaction,
    });
};

module.exports = {
    obtenerMaterial,
    obtenerNivelConBloqueo,
    obtenerInventarioConBloqueo,
    crearInventario,
    actualizarInventario,
    crearMovimiento,
};

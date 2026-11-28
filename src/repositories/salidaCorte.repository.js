const {
    Inventario,
    Material,
    Nivel,
    MaquinaCorte,
    MovimientoInventario,
} = require('../models');

const obtenerNivel = async (id, transaction) => {
    return await Nivel.findByPk(id, { transaction });
};

const obtenerMaterial = async (id, transaction) => {
    return await Material.findByPk(id, { transaction });
};

const obtenerMaquinaConBloqueo = async (id, transaction) => {
    return await MaquinaCorte.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerInventarioConBloqueo = async (
    materialId,
    nivelId,
    transaction
) => {
    return await Inventario.findOne({
        where: {
            material_id: materialId,
            nivel_id: nivelId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerMovimientoConBloqueo = async (id, transaction) => {
    return await MovimientoInventario.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerMovimiento = async (id) => {
    return await MovimientoInventario.findByPk(id);
};

const obtenerRetornos = async (movimientoSalidaId) => {
    return await MovimientoInventario.findAll({
        attributes: [
            'id',
            'codigo',
            'cantidad',
            'nivel_destino_id',
            'created_at',
        ],
        where: {
            tipo_movimiento: 'RETORNO_SECC',
            movimiento_salida_id: movimientoSalidaId,
        },
        order: [['created_at', 'ASC']],
    });
};

const obtenerCantidadRetornada = async (movimientoSalidaId, transaction) => {
    const resultado = await MovimientoInventario.sum('cantidad', {
        where: {
            tipo_movimiento: 'RETORNO_SECC',
            movimiento_salida_id: movimientoSalidaId,
        },
        transaction,
    });

    return resultado || 0;
};

const crearInventario = async (data, transaction) => {
    return await Inventario.create(data, { transaction });
};

const actualizarInventario = async (
    inventario,
    data,
    transaction
) => {
    await inventario.update(data, { transaction });
    return inventario;
};

const crearMovimiento = async (data, transaction) => {
    return await MovimientoInventario.create(data, { transaction });
};

module.exports = {
    obtenerNivel,
    obtenerMaterial,
    obtenerMaquinaConBloqueo,
    obtenerInventarioConBloqueo,
    obtenerMovimientoConBloqueo,
    obtenerMovimiento,
    obtenerRetornos,
    obtenerCantidadRetornada,
    crearInventario,
    actualizarInventario,
    crearMovimiento,
};

const {Inventario, Material, Nivel, Estante, Zona, MaquinaCorte, Reserva, MovimientoInventario} = require('../models');

const incluirInventario = {
    model: Inventario,
    as: 'inventario',
    include: [
        {
            model: Material,
            as: 'material',
        },
        {
            model: Nivel,
            as: 'nivel',
            include: [
                {
                    model: Estante,
                    as: 'estante',
                    include: [
                        {
                            model: Zona,
                            as: 'zona',
                        },
                    ],
                },
            ],
        },
    ],
};

const obtenerTodas = async () => {
    return await Reserva.findAll({
        include: [incluirInventario],
        order: [['created_at', 'DESC']],
    });
};

const obtenerPorId = async (id) => {
    return await Reserva.findByPk(id, {
        include: [incluirInventario],
    });
};

const obtenerPorIdConBloqueo = async (id, transaction) => {
    return await Reserva.findByPk(id, {
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

const obtenerInventarioPorIdConBloqueo = async (
    id,
    transaction
) => {
    return await Inventario.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerMaquinaConBloqueo = async (id, transaction) => {
    return await MaquinaCorte.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const crear = async (data, transaction) => {
    return await Reserva.create(data, { transaction });
};

const actualizar = async (reserva, data, transaction) => {
    await reserva.update(data, { transaction });
    return reserva;
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
    obtenerTodas,
    obtenerPorId,
    obtenerPorIdConBloqueo,
    obtenerInventarioConBloqueo,
    obtenerInventarioPorIdConBloqueo,
    obtenerMaquinaConBloqueo,
    crear,
    actualizar,
    actualizarInventario,
    crearMovimiento,
};

const {
    Retal,
    MovimientoInventario,
    Material,
    Nivel,
} = require('../models');

const incluirRelaciones = [
    {
        model: MovimientoInventario,
        as: 'salidaCorte',
        include: [
            {
                model: Material,
                as: 'material',
            },
        ],
    },
    {
        model: Nivel,
        as: 'nivel',
    },
];

const obtenerTodos = async () => {
    return await Retal.findAll({
        include: incluirRelaciones,
        order: [['created_at', 'DESC']],
    });
};

const obtenerPorId = async (id) => {
    return await Retal.findByPk(id, {
        include: incluirRelaciones,
    });
};

const obtenerSalidaConBloqueo = async (id, transaction) => {
    return await MovimientoInventario.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const obtenerMaterial = async (id, transaction) => {
    return await Material.findByPk(id, {
        transaction,
    });
};

const obtenerNivelConBloqueo = async (id, transaction) => {
    return await Nivel.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
};

const crear = async (data, transaction) => {
    return await Retal.create(data, { transaction });
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerSalidaConBloqueo,
    obtenerMaterial,
    obtenerNivelConBloqueo,
    crear,
};

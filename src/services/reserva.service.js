const crypto = require('crypto');
const sequelize = require('../config/database');
const repository = require('../repositories/reserva.repository');

const MAQUINAS_SECC = ['SECC 1', 'SECC 2', 'SECC 3', 'SECC 4'];

const validarCantidad = (cantidad) => {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad debe ser un número entero mayor que cero'
        );
    }
};

const obtenerEstado = (reserva, cantidadPendiente, cantidadConsumida, cantidadLiberada) => {
    if (cantidadPendiente > 0) {
        return cantidadPendiente === reserva.cantidad
            ? 'ACTIVA'
            : 'PARCIAL';
    }

    if (cantidadConsumida > 0 && cantidadLiberada > 0) {
        return 'FINALIZADA';
    }

    if (cantidadConsumida > 0) {
        return 'CONSUMIDA';
    }

    return 'LIBERADA';
};

const crear = async (data, usuarioId = null) => {
    const {
        material_id,
        nivel_id,
        cantidad,
        observacion,
    } = data;

    validarCantidad(cantidad);
    const transaction = await sequelize.transaction();

    try {
        const inventario =
            await repository.obtenerInventarioConBloqueo(
                material_id,
                nivel_id,
                transaction
            );

        if (!inventario || inventario.estado !== 'ACTIVO') {
            throw new Error(
                'No existe inventario activo de este material en el nivel indicado'
            );
        }

        const disponible =
            inventario.cantidad - inventario.cantidad_reservada;

        if (cantidad > disponible) {
            throw new Error(
                `Cantidad insuficiente. Disponible: ${disponible} planchas`
            );
        }

        await repository.actualizarInventario(
            inventario,
            {
                cantidad_reservada:
                    inventario.cantidad_reservada + cantidad,
            },
            transaction
        );

        const reserva = await repository.crear(
            {
                inventario_id: inventario.id,
                cantidad,
                cantidad_pendiente: cantidad,
                cantidad_consumida: 0,
                cantidad_liberada: 0,
                estado: 'ACTIVA',
                usuario_id: usuarioId,
                observacion: observacion || null,
            },
            transaction
        );

        await transaction.commit();

        return {
            reserva,
            inventario: {
                id: inventario.id,
                cantidad: inventario.cantidad,
                cantidad_reservada: inventario.cantidad_reservada,
                cantidad_disponible:
                    inventario.cantidad - inventario.cantidad_reservada,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const obtenerTodas = async () => {
    return await repository.obtenerTodas();
};

const obtenerPorId = async (id) => {
    const reserva = await repository.obtenerPorId(id);

    if (!reserva) {
        throw new Error('La reserva no existe');
    }

    return reserva;
};

const liberar = async (id, cantidad) => {
    validarCantidad(cantidad);
    const transaction = await sequelize.transaction();

    try {
        const reserva = await repository.obtenerPorIdConBloqueo(
            id,
            transaction
        );

        if (!reserva || reserva.cantidad_pendiente === 0) {
            throw new Error(
                'La reserva no existe o ya no tiene unidades pendientes'
            );
        }

        if (cantidad > reserva.cantidad_pendiente) {
            throw new Error(
                `La cantidad supera las unidades pendientes: ${reserva.cantidad_pendiente}`
            );
        }

        const inventario =
            await repository.obtenerInventarioPorIdConBloqueo(
                reserva.inventario_id,
                transaction
            );

        if (!inventario) {
            throw new Error(
                'No existe el inventario asociado a la reserva'
            );
        }

        if (inventario.cantidad_reservada < cantidad) {
            throw new Error(
                'La cantidad reservada del inventario no coincide con la reserva'
            );
        }

        const cantidadPendiente = reserva.cantidad_pendiente - cantidad;
        const cantidadLiberada = reserva.cantidad_liberada + cantidad;
        const estado = obtenerEstado(
            reserva,
            cantidadPendiente,
            reserva.cantidad_consumida,
            cantidadLiberada
        );

        await repository.actualizarInventario(
            inventario,
            {
                cantidad_reservada:
                    inventario.cantidad_reservada - cantidad,
            },
            transaction
        );

        await repository.actualizar(
            reserva,
            {
                cantidad_pendiente: cantidadPendiente,
                cantidad_liberada: cantidadLiberada,
                estado,
            },
            transaction
        );

        await transaction.commit();
        return reserva;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const cancelar = async (id) => {
    const transaction = await sequelize.transaction();

    try {
        const reserva = await repository.obtenerPorIdConBloqueo(
            id,
            transaction
        );

        if (!reserva || reserva.cantidad_pendiente === 0) {
            throw new Error(
                'La reserva no existe o ya no tiene unidades pendientes'
            );
        }

        const inventario =
            await repository.obtenerInventarioPorIdConBloqueo(
                reserva.inventario_id,
                transaction
            );

        if (!inventario) {
            throw new Error(
                'No existe el inventario asociado a la reserva'
            );
        }

        const pendiente = reserva.cantidad_pendiente;

        if (inventario.cantidad_reservada < pendiente) {
            throw new Error(
                'La cantidad reservada del inventario no coincide con la reserva'
            );
        }

        await repository.actualizarInventario(
            inventario,
            {
                cantidad_reservada:
                    inventario.cantidad_reservada - pendiente,
            },
            transaction
        );

        await repository.actualizar(
            reserva,
            {
                cantidad_pendiente: 0,
                cantidad_liberada:
                    reserva.cantidad_liberada + pendiente,
                estado: 'CANCELADA',
            },
            transaction
        );

        await transaction.commit();
        return reserva;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const consumir = async (id, data, usuarioId = null) => {
    const {
        cantidad,
        maquina_corte_id,
        observacion,
    } = data;

    validarCantidad(cantidad);
    const transaction = await sequelize.transaction();

    try {
        const reserva = await repository.obtenerPorIdConBloqueo(
            id,
            transaction
        );

        if (!reserva || reserva.cantidad_pendiente === 0) {
            throw new Error(
                'La reserva no existe o ya no tiene unidades pendientes'
            );
        }

        if (cantidad > reserva.cantidad_pendiente) {
            throw new Error(
                `La cantidad supera las unidades pendientes: ${reserva.cantidad_pendiente}`
            );
        }

        const inventario =
            await repository.obtenerInventarioPorIdConBloqueo(
                reserva.inventario_id,
                transaction
            );

        if (!inventario || inventario.estado !== 'ACTIVO') {
            throw new Error(
                'No existe inventario activo asociado a la reserva'
            );
        }

        if (
            inventario.cantidad_reservada < cantidad ||
            inventario.cantidad < cantidad
        ) {
            throw new Error(
                'Las existencias del inventario no coinciden con la reserva'
            );
        }

        const maquina = await repository.obtenerMaquinaConBloqueo(
            maquina_corte_id,
            transaction
        );

        if (
            !maquina ||
            maquina.estado !== 'ACTIVO' ||
            !MAQUINAS_SECC.includes(maquina.nombre)
        ) {
            throw new Error(
                'La máquina de corte no existe, está inactiva o no es una máquina SECC válida'
            );
        }

        await repository.actualizarInventario(
            inventario,
            {
                cantidad: inventario.cantidad - cantidad,
                cantidad_reservada:
                    inventario.cantidad_reservada - cantidad,
            },
            transaction
        );

        const cantidadPendiente = reserva.cantidad_pendiente - cantidad;
        const cantidadConsumida = reserva.cantidad_consumida + cantidad;
        const estado = obtenerEstado(
            reserva,
            cantidadPendiente,
            cantidadConsumida,
            reserva.cantidad_liberada
        );

        await repository.actualizar(
            reserva,
            {
                cantidad_pendiente: cantidadPendiente,
                cantidad_consumida: cantidadConsumida,
                estado,
            },
            transaction
        );

        const movimientoId = crypto.randomUUID();
        const codigoMovimiento =
            `MOV-${movimientoId.substring(0, 8).toUpperCase()}`;

        await repository.crearMovimiento(
            {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'SALIDA_SECC',
                material_id: inventario.material_id,
                cantidad,
                nivel_origen_id: inventario.nivel_id,
                nivel_destino_id: null,
                maquina_corte_id,
                usuario_id: usuarioId,
                observacion:
                    observacion ||
                    `Consumo de la reserva ${reserva.id}`,
            },
            transaction
        );

        await transaction.commit();

        return {
            reserva,
            movimiento: {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'SALIDA_SECC',
                cantidad,
                maquina_corte_id,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    crear,
    obtenerTodas,
    obtenerPorId,
    liberar,
    cancelar,
    consumir,
};

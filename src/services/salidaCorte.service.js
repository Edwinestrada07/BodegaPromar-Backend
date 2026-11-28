const crypto = require('crypto');
const sequelize = require('../config/database');
const repository = require('../repositories/salidaCorte.repository');

const MAQUINAS_SECC = ['SECC 1', 'SECC 2', 'SECC 3', 'SECC 4'];

const validarCantidad = (cantidad) => {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad debe ser un número entero mayor que cero'
        );
    }
};

const crearIdentidadMovimiento = () => {
    const id = crypto.randomUUID();
    return {
        id,
        codigo: `MOV-${id.substring(0, 8).toUpperCase()}`,
    };
};

const validarMaquina = (maquina) => {
    if (
        !maquina ||
        maquina.estado !== 'ACTIVO' ||
        !MAQUINAS_SECC.includes(maquina.nombre)
    ) {
        throw new Error(
            'La máquina de corte no existe, está inactiva o no es una máquina SECC válida'
        );
    }
};

const obtenerPorId = async (movimientoSalidaId) => {
    const salida = await repository.obtenerMovimiento(
        movimientoSalidaId
    );

    if (!salida || salida.tipo_movimiento !== 'SALIDA_SECC') {
        throw new Error(
            'No existe una salida de corte válida con ese ID'
        );
    }

    const retornos = await repository.obtenerRetornos(salida.id);
    const cantidadRetornada = retornos.reduce(
        (total, retorno) => total + retorno.cantidad,
        0
    );

    return {
        salida,
        retornos,
        cantidad_retornada: cantidadRetornada,
        cantidad_pendiente_retorno:
            salida.cantidad - cantidadRetornada,
    };
};

const registrarSalida = async (data, usuarioId = null) => {
    const {
        material_id,
        nivel_origen_id,
        maquina_corte_id,
        cantidad,
        observacion,
    } = data;

    validarCantidad(cantidad);
    const transaction = await sequelize.transaction();

    try {
        const material = await repository.obtenerMaterial(
            material_id,
            transaction
        );

        if (!material || material.estado !== 'ACTIVO') {
            throw new Error(
                'El material no existe o está inactivo'
            );
        }

        const nivel = await repository.obtenerNivel(
            nivel_origen_id,
            transaction
        );

        if (!nivel || nivel.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de origen no existe o está inactivo'
            );
        }

        const maquina = await repository.obtenerMaquinaConBloqueo(
            maquina_corte_id,
            transaction
        );
        validarMaquina(maquina);

        const inventario =
            await repository.obtenerInventarioConBloqueo(
                material_id,
                nivel_origen_id,
                transaction
            );

        if (!inventario || inventario.estado !== 'ACTIVO') {
            throw new Error(
                'No existe inventario activo de este material en el nivel de origen'
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
                cantidad: inventario.cantidad - cantidad,
            },
            transaction
        );

        const movimiento = crearIdentidadMovimiento();

        await repository.crearMovimiento(
            {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'SALIDA_SECC',
                material_id,
                cantidad,
                nivel_origen_id,
                nivel_destino_id: null,
                maquina_corte_id,
                movimiento_salida_id: null,
                usuario_id: usuarioId,
                observacion:
                    observacion || 'Salida de material hacia corte',
            },
            transaction
        );

        await transaction.commit();

        return {
            movimiento: {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'SALIDA_SECC',
                material_id,
                cantidad,
                nivel_origen_id,
                maquina_corte_id,
            },
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

const registrarRetornoCompleto = async (
    movimientoSalidaId,
    data,
    usuarioId = null
) => {
    const {
        nivel_destino_id,
        cantidad,
        observacion,
    } = data;

    validarCantidad(cantidad);
    const transaction = await sequelize.transaction();

    try {
        const salida = await repository.obtenerMovimientoConBloqueo(
            movimientoSalidaId,
            transaction
        );

        if (!salida || salida.tipo_movimiento !== 'SALIDA_SECC') {
            throw new Error(
                'No existe una salida de corte válida con ese ID'
            );
        }

        const maquina = await repository.obtenerMaquinaConBloqueo(
            salida.maquina_corte_id,
            transaction
        );
        validarMaquina(maquina);

        const nivel = await repository.obtenerNivel(
            nivel_destino_id,
            transaction
        );

        if (!nivel || nivel.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de destino no existe o está inactivo'
            );
        }

        const retornada =
            await repository.obtenerCantidadRetornada(
                salida.id,
                transaction
            );
        const pendiente = salida.cantidad - retornada;

        if (cantidad > pendiente) {
            throw new Error(
                `La cantidad supera las planchas pendientes de retorno: ${pendiente}`
            );
        }

        let inventario =
            await repository.obtenerInventarioConBloqueo(
                salida.material_id,
                nivel_destino_id,
                transaction
            );

        if (inventario) {
            if (inventario.estado !== 'ACTIVO') {
                throw new Error(
                    'El inventario del nivel de destino está inactivo'
                );
            }

            await repository.actualizarInventario(
                inventario,
                {
                    cantidad: inventario.cantidad + cantidad,
                },
                transaction
            );
        } else {
            inventario = await repository.crearInventario(
                {
                    material_id: salida.material_id,
                    nivel_id: nivel_destino_id,
                    cantidad,
                    cantidad_reservada: 0,
                    estado: 'ACTIVO',
                },
                transaction
            );
        }

        const movimiento = crearIdentidadMovimiento();

        await repository.crearMovimiento(
            {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'RETORNO_SECC',
                material_id: salida.material_id,
                cantidad,
                nivel_origen_id: null,
                nivel_destino_id,
                maquina_corte_id: salida.maquina_corte_id,
                movimiento_salida_id: salida.id,
                usuario_id: usuarioId,
                observacion:
                    observacion ||
                    `Retorno de planchas completas de la salida ${salida.codigo}`,
            },
            transaction
        );

        await transaction.commit();

        return {
            movimiento: {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'RETORNO_SECC',
                movimiento_salida_id: salida.id,
                material_id: salida.material_id,
                cantidad,
                nivel_destino_id,
                maquina_corte_id: salida.maquina_corte_id,
            },
            salida: {
                id: salida.id,
                codigo: salida.codigo,
                cantidad_salida: salida.cantidad,
                cantidad_retornada: retornada + cantidad,
                cantidad_pendiente_retorno: pendiente - cantidad,
            },
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

module.exports = {
    obtenerPorId,
    registrarSalida,
    registrarRetornoCompleto,
};

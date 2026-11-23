/** Servicio para manejar los ajustes de inventario, tanto positivos como negativos. */

const crypto = require('crypto');
const sequelize = require('../config/database');
const repository = require('../repositories/ajusteInventario.repository');

const crearCodigoMovimiento = () => {
    const movimientoId = crypto.randomUUID();
    return {
        id: movimientoId,
        codigo: `MOV-${movimientoId.substring(0, 8).toUpperCase()}`,
    };
};

const validarCantidad = (cantidad) => {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad debe ser un número entero mayor que cero'
        );
    }
};

const ajustarPositivo = async (data, usuarioId = null) => {
    const {
        material_id,
        nivel_destino_id,
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

        if (!material) {
            throw new Error('El material indicado no existe');
        }

        const nivel = await repository.obtenerNivelConBloqueo(
            nivel_destino_id,
            transaction
        );

        if (!nivel || nivel.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de destino no existe o está inactivo'
            );
        }

        let inventario =
            await repository.obtenerInventarioConBloqueo(
                material_id,
                nivel_destino_id,
                transaction
            );

        if (inventario) {
            if (inventario.estado !== 'ACTIVO') {
                throw new Error(
                    'El registro de inventario está inactivo'
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
                    material_id,
                    nivel_id: nivel_destino_id,
                    cantidad,
                    cantidad_reservada: 0,
                    estado: 'ACTIVO',
                },
                transaction
            );
        }

        const movimiento = crearCodigoMovimiento();

        await repository.crearMovimiento(
            {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'AJUSTE_POSITIVO',
                material_id,
                cantidad,
                nivel_origen_id: null,
                nivel_destino_id,
                maquina_corte_id: null,
                usuario_id: usuarioId,
                observacion:
                    observacion ||
                    'Ajuste positivo de inventario',
            },
            transaction
        );

        await transaction.commit();

        return {
            inventario,
            movimiento: {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'AJUSTE_POSITIVO',
                cantidad,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const ajustarNegativo = async (data, usuarioId = null) => {
    const {
        material_id,
        nivel_origen_id,
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

        if (!material) {
            throw new Error('El material indicado no existe');
        }

        const nivel = await repository.obtenerNivelConBloqueo(
            nivel_origen_id,
            transaction
        );

        if (!nivel || nivel.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de origen no existe o está inactivo'
            );
        }

        const inventario =
            await repository.obtenerInventarioConBloqueo(
                material_id,
                nivel_origen_id,
                transaction
            );

        if (!inventario || inventario.estado !== 'ACTIVO') {
            throw new Error(
                'No existe inventario activo de este material en el nivel indicado'
            );
        }

        const cantidadDisponible =
            inventario.cantidad -
            inventario.cantidad_reservada;

        if (cantidad > cantidadDisponible) {
            throw new Error(
                `Cantidad insuficiente. Disponible: ${cantidadDisponible} planchas`
            );
        }

        await repository.actualizarInventario(
            inventario,
            {
                cantidad: inventario.cantidad - cantidad,
            },
            transaction
        );

        const movimiento = crearCodigoMovimiento();

        await repository.crearMovimiento(
            {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'AJUSTE_NEGATIVO',
                material_id,
                cantidad,
                nivel_origen_id,
                nivel_destino_id: null,
                maquina_corte_id: null,
                usuario_id: usuarioId,
                observacion:
                    observacion ||
                    'Ajuste negativo de inventario',
            },
            transaction
        );

        await transaction.commit();

        return {
            inventario,
            movimiento: {
                id: movimiento.id,
                codigo: movimiento.codigo,
                tipo_movimiento: 'AJUSTE_NEGATIVO',
                cantidad,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    ajustarPositivo,
    ajustarNegativo,
};

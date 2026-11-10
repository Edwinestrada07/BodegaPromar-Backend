/** Este archivo contiene funciones para interactuar con la base de datos relacionadas con los inventarios, 
    permitiendo obtener, crear y actualizar registros en la tabla "inventarios". Estas funciones facilitan la gestión
    de los inventarios disponibles en el sistema.
**/

const sequelize = require('../config/database');
const inventarioRepository = require('../repositories/inventario.repository');
const movimientoRepository = require('../repositories/movimientoInventario.repository');

const crypto = require('crypto');

// Función para formatear los datos del inventario, calculando la cantidad disponible a partir de la
// cantidad total y la cantidad reservada.
const formatearInventario = (inventario) => {
    const datos = inventario.toJSON();

    datos.cantidad_disponible =
        datos.cantidad - datos.cantidad_reservada;

    return datos;
};

const obtenerTodos = async () => {
    const inventarios =
        await inventarioRepository.obtenerTodos();

    return inventarios.map(formatearInventario);
};

const obtenerPorId = async (id) => {
    const inventario =
        await inventarioRepository.obtenerPorId(id);

    if (!inventario) {
        throw new Error('El registro de inventario no existe');
    }

    return formatearInventario(inventario);
};

// <<<<< Función para registrar la entrada de material en el inventario, actualizando la cantidad existente o creando un 
// nuevo registro si no existe. >>>>>
const registrarEntrada = async (data, usuario_id = null) => {

    const {
        material_id,
        cantidad,
        nivel_destino_id,
        observacion
    } = data;

    // 1. Validaciones iniciales

    if (!material_id || !nivel_destino_id || !cantidad) {
        throw new Error(
            'Material, cantidad y nivel de destino son obligatorios'
        );
    }

    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad debe ser un número entero mayor que cero'
        );
    }

    // 2. Iniciar transacción

    const transaction = await sequelize.transaction();

    try {

        // 3. Verificar existencia del material

        const material =
            await inventarioRepository.obtenerMaterial(
                material_id,
                transaction
            );

        if (!material) {
            throw new Error('El material indicado no existe');
        }

        // 4. Verificar existencia del nivel

        const nivel =
            await inventarioRepository.obtenerNivel(
                nivel_destino_id,
                transaction
            );

        if (!nivel) {
            throw new Error('El nivel de destino no existe');
        }

        // 5. Buscar inventario existente

        let inventario =
            await inventarioRepository.obtenerPorMaterialYNivel(
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

            // Sumar cantidad al inventario existente

            await inventarioRepository.actualizar(
                inventario,
                {
                    cantidad:
                        inventario.cantidad + cantidad
                },
                transaction
            );

        } else {

            // Crear nuevo inventario

            inventario =
                await inventarioRepository.crear(
                    {
                        material_id,
                        nivel_id: nivel_destino_id,
                        cantidad,
                        cantidad_reservada: 0,
                        estado: 'ACTIVO'
                    },
                    transaction
                );

        }

        // 6. Generar identificador del movimiento

        const movimientoId = crypto.randomUUID();

        const codigoMovimiento =
            `MOV-${movimientoId.substring(0, 8).toUpperCase()}`;

        // 7. Registrar movimiento histórico

        await movimientoRepository.create(
            {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'ENTRADA',
                material_id,
                cantidad,
                nivel_origen_id: null,
                nivel_destino_id,
                maquina_corte_id: null,
                usuario_id,
                observacion: observacion || 'Entrada de material a bodega'
            },
            transaction
        );

        // 8. Confirmar transacción

        await transaction.commit();

        return {
            inventario,
            movimiento: {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'ENTRADA',
                cantidad
            }
        };

    } catch (error) {

        await transaction.rollback();

        throw error;

    }

};

// <<<<< Función para registrar el traslado de material entre niveles, actualizando los inventarios correspondientes
// registrando el movimiento histórico. >>>>>
const registrarTraslado = async (data, usuario_id = null) => {

    const {
        material_id,
        nivel_origen_id,
        nivel_destino_id,
        cantidad,
        observacion
    } = data;

    // 1. Validaciones iniciales

    if (
        !material_id ||
        !nivel_origen_id ||
        !nivel_destino_id ||
        cantidad === undefined ||
        cantidad === null
    ) {
        throw new Error(
            'Material, niveles de origen y destino, y cantidad son obligatorios'
        );
    }

    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
        throw new Error(
            'La cantidad debe ser un número entero mayor que cero'
        );
    }

    if (nivel_origen_id === nivel_destino_id) {
        throw new Error(
            'El nivel de origen y destino no pueden ser iguales'
        );
    }

    // 2. Iniciar transacción

    const transaction = await sequelize.transaction();

    try {

        // 3. Verificar existencia del material

        const material =
            await inventarioRepository.obtenerMaterial(
                material_id,
                transaction
            );

        if (!material) {
            throw new Error('El material indicado no existe');
        }

        // 4. Verificar los niveles

        const nivelOrigen =
            await inventarioRepository.obtenerNivel(
                nivel_origen_id,
                transaction
            );

        if (!nivelOrigen || nivelOrigen.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de origen no existe o está inactivo'
            );
        }

        const nivelDestino =
            await inventarioRepository.obtenerNivel(
                nivel_destino_id,
                transaction
            );

        if (!nivelDestino || nivelDestino.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de destino no existe o está inactivo'
            );
        }

        // 5. Buscar inventario en el nivel de origen

        const inventarioOrigen =
            await inventarioRepository.obtenerPorMaterialYNivel(
                material_id,
                nivel_origen_id,
                transaction
            );

        if (!inventarioOrigen || inventarioOrigen.estado !== 'ACTIVO') {
            throw new Error(
                'No existe inventario activo de este material en el nivel de origen'
            );
        }

        // 6. Comprobar cantidad disponible

        const cantidadDisponible =
            inventarioOrigen.cantidad -
            inventarioOrigen.cantidad_reservada;

        if (cantidad > cantidadDisponible) {
            throw new Error(
                `Cantidad insuficiente. Disponible: ${cantidadDisponible} planchas`
            );
        }

        // 7. Descontar cantidad del origen

        await inventarioRepository.actualizar(
            inventarioOrigen,
            {
                cantidad: inventarioOrigen.cantidad - cantidad
            },
            transaction
        );

        // 8. Buscar inventario en el destino

        let inventarioDestino =
            await inventarioRepository.obtenerPorMaterialYNivel(
                material_id,
                nivel_destino_id,
                transaction
            );

        if (inventarioDestino) {

            if (inventarioDestino.estado !== 'ACTIVO') {
                throw new Error(
                    'El inventario del nivel de destino está inactivo'
                );
            }

            // Sumar cantidad al inventario existente

            await inventarioRepository.actualizar(
                inventarioDestino,
                {
                    cantidad: inventarioDestino.cantidad + cantidad
                },
                transaction
            );

        } else {

            // Crear inventario en el destino

            inventarioDestino =
                await inventarioRepository.crear(
                    {
                        material_id,
                        nivel_id: nivel_destino_id,
                        cantidad,
                        cantidad_reservada: 0,
                        estado: 'ACTIVO'
                    },
                    transaction
                );

        }

        // 9. Generar identificador del movimiento

        const movimientoId = crypto.randomUUID();

        const codigoMovimiento =
            `MOV-${movimientoId.substring(0, 8).toUpperCase()}`;

        // 10. Registrar movimiento histórico

        await movimientoRepository.create(
            {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'TRASLADO',
                material_id,
                cantidad,
                nivel_origen_id,
                nivel_destino_id,
                maquina_corte_id: null,
                usuario_id,
                observacion: observacion || 'Traslado de material entre niveles'
            },
            transaction
        );

        // 11. Confirmar transacción

        await transaction.commit();

        return {
            origen: {
                id: inventarioOrigen.id,
                nivel_id: nivel_origen_id,
                cantidad: inventarioOrigen.cantidad,
                cantidad_reservada: inventarioOrigen.cantidad_reservada,
                cantidad_disponible:
                    inventarioOrigen.cantidad -
                    inventarioOrigen.cantidad_reservada
            },
            destino: {
                id: inventarioDestino.id,
                nivel_id: nivel_destino_id,
                cantidad: inventarioDestino.cantidad,
                cantidad_reservada: inventarioDestino.cantidad_reservada,
                cantidad_disponible:
                    inventarioDestino.cantidad -
                    inventarioDestino.cantidad_reservada
            },
            movimiento: {
                id: movimientoId,
                codigo: codigoMovimiento,
                tipo_movimiento: 'TRASLADO',
                cantidad
            }
        };

    } catch (error) {

        await transaction.rollback();

        throw error;

    }

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    registrarEntrada,
    registrarTraslado
};
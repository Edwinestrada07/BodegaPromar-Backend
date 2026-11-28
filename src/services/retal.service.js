const sequelize = require('../config/database');
const repository = require('../repositories/retal.repository');

const DIMENSION_MAXIMA = 2147483647;
const ESTADOS_RETAL = ['REUTILIZABLE', 'DAÑADO'];

const validarEnteroPositivo = (valor, nombre) => {
    if (
        !Number.isSafeInteger(valor) ||
        valor <= 0 ||
        valor > DIMENSION_MAXIMA
    ) {
        throw new Error(
            `${nombre} debe ser un entero positivo dentro del rango permitido`
        );
    }
};

const crear = async (data, usuarioId = null) => {
    const {
        movimiento_salida_id,
        nivel_id,
        largo_mm,
        ancho_mm,
        cantidad,
        estado = 'REUTILIZABLE',
        observacion,
    } = data;

    validarEnteroPositivo(largo_mm, 'largo_mm');
    validarEnteroPositivo(ancho_mm, 'ancho_mm');
    validarEnteroPositivo(cantidad, 'cantidad');

    if (!ESTADOS_RETAL.includes(estado)) {
        throw new Error(
            'estado debe ser REUTILIZABLE o DAÑADO'
        );
    }

    const transaction = await sequelize.transaction();

    try {
        const salida = await repository.obtenerSalidaConBloqueo(
            movimiento_salida_id,
            transaction
        );

        if (!salida || salida.tipo_movimiento !== 'SALIDA_SECC') {
            throw new Error(
                'No existe una salida de corte válida con ese ID'
            );
        }

        const material = await repository.obtenerMaterial(
            salida.material_id,
            transaction
        );

        if (!material) {
            throw new Error(
                'No existe el material asociado a la salida de corte'
            );
        }

        const dimensionesEncajan =
            (largo_mm <= material.largo_mm &&
                ancho_mm <= material.ancho_mm) ||
            (largo_mm <= material.ancho_mm &&
                ancho_mm <= material.largo_mm);

        if (!dimensionesEncajan) {
            throw new Error(
                'Las dimensiones del retal no pueden superar las dimensiones de la plancha de origen'
            );
        }

        const nivel = await repository.obtenerNivelConBloqueo(
            nivel_id,
            transaction
        );

        if (!nivel || nivel.estado !== 'ACTIVO') {
            throw new Error(
                'El nivel de almacenamiento no existe o está inactivo'
            );
        }

        const retal = await repository.crear(
            {
                movimiento_salida_id,
                nivel_id,
                largo_mm,
                ancho_mm,
                espesor_mm: material.espesor_mm,
                cantidad,
                estado,
                usuario_id: usuarioId,
                observacion: observacion || null,
            },
            transaction
        );

        await transaction.commit();

        return retal;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const obtenerTodos = async () => {
    return await repository.obtenerTodos();
};

const obtenerPorId = async (id) => {
    const retal = await repository.obtenerPorId(id);

    if (!retal) {
        throw new Error('El retal no existe');
    }

    return retal;
};

module.exports = {
    crear,
    obtenerTodos,
    obtenerPorId,
};

/** Este archivo contiene el modelo de datos para la tabla movimientos_inventario en la 
    base de datos. Define la estructura de la tabla y sus atributos utilizando Sequelize.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoInventario = sequelize.define(
        'MovimientoInventario',
        {

            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            codigo: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },

            tipo_movimiento: {
                type: DataTypes.ENUM(
                    'ENTRADA',
                    'TRASLADO',
                    'SALIDA_SECC',
                    'RETORNO_SECC',
                    'AJUSTE_POSITIVO',
                    'AJUSTE_NEGATIVO'
                ),
                allowNull: false,
            },

            material_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            nivel_origen_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            nivel_destino_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            maquina_corte_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            movimiento_salida_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            usuario_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            observacion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

        },
        {
            tableName:
                'movimientos_inventario',

            timestamps: true,

            createdAt: 'created_at',

            updatedAt: 'updated_at',
        }
    );

module.exports = MovimientoInventario;
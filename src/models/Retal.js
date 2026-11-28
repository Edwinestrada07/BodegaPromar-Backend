const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Retal = sequelize.define(
    'Retal',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        movimiento_salida_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        nivel_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        largo_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        ancho_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        espesor_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        estado: {
            type: DataTypes.ENUM(
                'REUTILIZABLE',
                'DAÑADO'
            ),
            allowNull: false,
            defaultValue: 'REUTILIZABLE',
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
        tableName: 'retales',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Retal;

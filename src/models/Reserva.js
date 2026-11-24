const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define(
    'Reserva',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        inventario_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        cantidad_pendiente: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        cantidad_consumida: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        cantidad_liberada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        estado: {
            type: DataTypes.ENUM(
                'ACTIVA',
                'PARCIAL',
                'LIBERADA',
                'CANCELADA',
                'CONSUMIDA',
                'FINALIZADA'
            ),
            allowNull: false,
            defaultValue: 'ACTIVA',
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
        tableName: 'reservas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Reserva;

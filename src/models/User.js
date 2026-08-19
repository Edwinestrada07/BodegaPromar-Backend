/** Este archivo es para definir el modelo de datos de la tabla de usuarios en la base de datos. Model Define 
    cómo Sequelize interactúa con PostgreSQL
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        rol_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        estado: {
            type: DataTypes.ENUM(
                'ACTIVO',
                'INACTIVO'
            ),
            allowNull: false,
            defaultValue: 'ACTIVO',
        },

        ultimo_acceso: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = User;
/** Este archivo es para definir el modelo de datos de la tabla de roles en la base de datos. Model
    │
    └── Define cómo Sequelize interactúa con PostgreSQL **/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define(
    'Role',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },

        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },

        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Role;
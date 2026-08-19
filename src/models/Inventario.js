/** Este archivo contiene la definición del modelo "Inventario" utilizando Sequelize. El modelo representa 
    la tabla "inventarios" en la base de datos y define sus atributos.
**/

const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Inventario = sequelize.define(
    'Inventario',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        material_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        nivel_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },

        cantidad_reservada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },

        estado: {
            type: DataTypes.ENUM(
                'ACTIVO',
                'INACTIVO'
            ),
            allowNull: false,
            defaultValue: 'ACTIVO',
        },
    },
    {
        tableName: 'inventarios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Inventario;
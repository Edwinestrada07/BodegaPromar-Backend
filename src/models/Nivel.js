/** Este archivo contiene la definición del modelo "Nivel" utilizando Sequelize. El modelo representa la tabla
    "niveles" en la base de datos y define sus atributos, tipos de datos y restricciones. La tabla "niveles" almacena
    información sobre los niveles de almacenamiento en el sistema, incluyendo un identificador único, número, código,
    descripción y estado.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nivel = sequelize.define(
    'Nivel',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        estante_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        numero: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        codigo: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'niveles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Nivel;
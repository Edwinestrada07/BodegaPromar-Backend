/** Este archivo contiene la definición del modelo "Estante" utilizando Sequelize. El modelo representa la tabla
    "estantes" en la base de datos y define sus atributos, tipos de datos y restricciones. La tabla "estantes" almacena
    información sobre los estantes de almacenamiento en el sistema, incluyendo un identificador único, código, nombre,
    descripción y estado.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estante = sequelize.define(
    'Estante',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        zona_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        codigo: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },

        nombre: {
            type: DataTypes.STRING(100),
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
        tableName: 'estantes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Estante;
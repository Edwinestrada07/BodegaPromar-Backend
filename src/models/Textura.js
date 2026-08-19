/** Este archivo contiene la definición del modelo "Textura" utilizando Sequelize. El modelo representa la tabla
    "texturas" en la base de datos y define sus atributos, tipos de datos y restricciones.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Textura = sequelize.define(
    'Textura',
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

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
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
        tableName: 'texturas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Textura;

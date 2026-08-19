/** Este archivo contiene la definición del modelo "Zona" utilizando Sequelize. El modelo representa la tabla 
    "zonas" en la base de datos y define sus atributos, tipos de datos y restricciones. La tabla "zonas" almacena 
    información sobre las zonas de almacenamiento en el sistema, incluyendo un identificador único, código, nombre, 
    descripción y estado.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zona = sequelize.define(
    'Zona',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        codigo: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
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
                'ACTIVA',
                'INACTIVA'
            ),
            allowNull: false,
            defaultValue: 'ACTIVA',
        },
    },
    {
        tableName: 'zonas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Zona;
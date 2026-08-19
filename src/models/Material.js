/** Este archivo contiene la definición del modelo "Material" utilizando Sequelize. El modelo representa 
    la tabla "materiales" en la base de datos y define sus atributos.
**/

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define(
    'Material',
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

        tipo_material_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        color_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        textura_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        espesor_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        largo_mm: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        ancho_mm: {
            type: DataTypes.INTEGER,
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
    },
    {
        tableName: 'materiales',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Material;
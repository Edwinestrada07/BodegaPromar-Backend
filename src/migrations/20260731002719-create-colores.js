/** Este archivo contiene la migración para crear la tabla "colores" en la base de datos. **/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('colores', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            codigo: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },

            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },

            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            estado: {
                type: Sequelize.ENUM(
                    'ACTIVO',
                    'INACTIVO'
                ),
                allowNull: false,
                defaultValue: 'ACTIVO',
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('colores');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_colores_estado";'
        );
    },
};

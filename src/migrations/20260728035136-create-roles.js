/** Este archivo es para crear la tabla de roles en la base de datos. Migration
    │
    └── Define estructura de PostgreSQL **/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('roles', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            nombre: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },

            descripcion: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },

            estado: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
        await queryInterface.dropTable('roles');
    },
};

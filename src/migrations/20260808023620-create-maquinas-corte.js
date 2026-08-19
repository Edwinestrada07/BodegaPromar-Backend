/** Este archivo contiene la migración para crear la tabla "maquinas_corte" en la base de datos. La tabla 
    "maquinas_corte" almacena información sobre las máquinas de corte disponibles, incluyendo su ID, código, nombre, 
    descripción y estado. La migración también define las relaciones con otras tablas.
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable('maquinas_corte', {

            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal(
                    'gen_random_uuid()'
                ),
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
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP'
                ),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP'
                ),
            },

        });
    },

    async down(queryInterface) {

        await queryInterface.dropTable(
            'maquinas_corte'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_maquinas_corte_estado";'
        );
    },
};

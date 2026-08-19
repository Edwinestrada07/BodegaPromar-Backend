/** Este archivo contiene la migración para crear la tabla "zonas" en la base de datos. La tabla "zonas"
    almacena información sobre las zonas de almacenamiento en el sistema. La migración también define las 
    restricciones y relaciones necesarias para garantizar la integridad de los datos en la tabla "zonas".
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('zonas', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            codigo: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },

            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            estado: {
                type: Sequelize.ENUM(
                    'ACTIVA',
                    'INACTIVA'
                ),
                allowNull: false,
                defaultValue: 'ACTIVA',
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
        await queryInterface.dropTable('zonas');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_zonas_estado";'
        );
    },
};

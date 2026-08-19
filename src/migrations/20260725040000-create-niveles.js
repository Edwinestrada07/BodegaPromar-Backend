/** Este archivo contiene la migración para crear la tabla "niveles" en la base de datos. La tabla "niveles"
    almacena información sobre los niveles de almacenamiento en el sistema. La migración también define las 
    restricciones y relaciones necesarias para garantizar la integridad de los datos en la tabla "niveles".
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('niveles', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            estante_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'estantes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            numero: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            codigo: {
                type: Sequelize.STRING(20),
                allowNull: false,
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

        await queryInterface.addConstraint(
            'niveles',
            {
                fields: ['estante_id', 'numero'],
                type: 'unique',
                name: 'niveles_estante_numero_unique',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('niveles');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_niveles_estado";'
        );
    },
};

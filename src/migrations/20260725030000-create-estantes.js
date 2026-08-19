/** Este archivo contiene la migración para crear la tabla "estantes" en la base de datos. La tabla "estantes"
    almacena información sobre los estantes de almacenamiento en el sistema. La migración también define las 
    restricciones y relaciones necesarias para garantizar la integridad de los datos en la tabla "estantes".
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('estantes', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            zona_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'zonas',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            codigo: {
                type: Sequelize.STRING(20),
                allowNull: false,
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
            'estantes',
            {
                fields: ['zona_id', 'codigo'],
                type: 'unique',
                name: 'estantes_zona_codigo_unique',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable('estantes');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_estantes_estado";'
        );
    },
};

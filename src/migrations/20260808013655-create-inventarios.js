/** Este archivo contiene la migración para crear la tabla "inventarios" en la base de datos. La tabla 
    "inventarios" almacena información sobre los inventarios disponibles, incluyendo su ID, ID del material, ID del nivel, cantidad y cantidad reservada. Además, se establece una restricción única para 
    garantizar que no existan inventarios duplicados con las mismas características. La migración también 
    define las relaciones con las tablas "materiales" y "niveles".
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable('inventarios', {

            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal(
                    'gen_random_uuid()'
                ),
            },

            material_id: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'materiales',
                    key: 'id',
                },

                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            nivel_id: {
                type: Sequelize.UUID,
                allowNull: false,

                references: {
                    model: 'niveles',
                    key: 'id',
                },

                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            cantidad: {
                type: Sequelize.INTEGER,
                allowNull: false,

                defaultValue: 0,

                validate: {
                    min: 0,
                },
            },

            cantidad_reservada: {
                type: Sequelize.INTEGER,
                allowNull: false,

                defaultValue: 0,

                validate: {
                    min: 0,
                },
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

                defaultValue:
                    Sequelize.literal(
                        'CURRENT_TIMESTAMP'
                    ),
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,

                defaultValue:
                    Sequelize.literal(
                        'CURRENT_TIMESTAMP'
                    ),
            },

        });

        await queryInterface.addConstraint(
            'inventarios',
            {
                fields: [
                    'material_id',
                    'nivel_id',
                ],

                type: 'unique',

                name:
                    'unique_material_nivel_inventario',
            }
        );
    },

    async down(queryInterface) {

        await queryInterface.removeConstraint(
            'inventarios',
            'unique_material_nivel_inventario'
        );

        await queryInterface.dropTable(
            'inventarios'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_inventarios_estado";'
        );
    },
};

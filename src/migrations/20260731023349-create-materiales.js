/** Este archivo contiene la migración para crear la tabla "materiales" en la base de datos. La tabla 
    "materiales" almacena información sobre los materiales disponibles, incluyendo su código, tipo de 
    material, color, textura, dimensiones y estado. Además, se establece una restricción única para 
    garantizar que no existan materiales duplicados con las mismas características. La migración también 
    define las relaciones con las tablas "tipos_material", "colores" y "texturas".
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable('materiales', {

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

            tipo_material_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'tipos_material',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            color_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'colores',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            textura_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'texturas',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            espesor_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            largo_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            ancho_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
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

        await queryInterface.addConstraint(
            'materiales',
            {
                fields: [
                    'tipo_material_id',
                    'color_id',
                    'textura_id',
                    'espesor_mm',
                    'largo_mm',
                    'ancho_mm',
                ],
                type: 'unique',
                name: 'unique_material_caracteristicas',
            }
        );
    },

    async down(queryInterface) {

        await queryInterface.removeConstraint(
            'materiales',
            'unique_material_caracteristicas'
        );

        await queryInterface.dropTable(
            'materiales'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_materiales_estado";'
        );
    },
};

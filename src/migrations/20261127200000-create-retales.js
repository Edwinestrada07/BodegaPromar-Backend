'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('retales', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            movimiento_salida_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'movimientos_inventario',
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

            largo_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            ancho_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            espesor_mm: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            cantidad: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            estado: {
                type: Sequelize.ENUM(
                    'REUTILIZABLE',
                    'DAÑADO'
                ),
                allowNull: false,
                defaultValue: 'REUTILIZABLE',
            },

            usuario_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'usuarios',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            observacion: {
                type: Sequelize.TEXT,
                allowNull: true,
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
        await queryInterface.dropTable('retales');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_retales_estado";'
        );
    },
};

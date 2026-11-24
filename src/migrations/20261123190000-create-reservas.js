'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reservas', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            inventario_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'inventarios',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            cantidad: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            cantidad_pendiente: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            cantidad_consumida: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            cantidad_liberada: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            estado: {
                type: Sequelize.ENUM(
                    'ACTIVA',
                    'PARCIAL',
                    'LIBERADA',
                    'CANCELADA',
                    'CONSUMIDA',
                    'FINALIZADA'
                ),
                allowNull: false,
                defaultValue: 'ACTIVA',
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
        await queryInterface.dropTable('reservas');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_reservas_estado";'
        );
    },
};

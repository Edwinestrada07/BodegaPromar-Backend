/** Este archivo contiene la migración para crear la tabla movimientos_inventario. en la base de datos */

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable(
            'movimientos_inventario',
            {

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

                tipo_movimiento: {
                    type: Sequelize.ENUM(
                        'ENTRADA',
                        'TRASLADO',
                        'SALIDA_SECC',
                        'RETORNO_SECC',
                        'AJUSTE_POSITIVO',
                        'AJUSTE_NEGATIVO'
                    ),
                    allowNull: false,
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

                cantidad: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },

                nivel_origen_id: {
                    type: Sequelize.UUID,
                    allowNull: true,

                    references: {
                        model: 'niveles',
                        key: 'id',
                    },

                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT',
                },

                nivel_destino_id: {
                    type: Sequelize.UUID,
                    allowNull: true,

                    references: {
                        model: 'niveles',
                        key: 'id',
                    },

                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT',
                },

                maquina_corte_id: {
                    type: Sequelize.UUID,
                    allowNull: true,

                    references: {
                        model: 'maquinas_corte',
                        key: 'id',
                    },

                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT',
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

            }
        );

    },

    async down(queryInterface) {

        await queryInterface.dropTable(
            'movimientos_inventario'
        );

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_movimientos_inventario_tipo_movimiento";'
        );

    },
};

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'movimientos_inventario',
            'movimiento_salida_id',
            {
                type: Sequelize.UUID,
                allowNull: true,
            }
        );

        await queryInterface.addConstraint(
            'movimientos_inventario',
            {
                fields: ['movimiento_salida_id'],
                type: 'foreign key',
                name: 'fk_movimiento_retorno_salida_corte',
                references: {
                    table: 'movimientos_inventario',
                    field: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeConstraint(
            'movimientos_inventario',
            'fk_movimiento_retorno_salida_corte'
        );
        await queryInterface.removeColumn(
            'movimientos_inventario',
            'movimiento_salida_id'
        );
    },
};

/** Este archivo es un seeder que inserta registros de máquinas de corte en la tabla "maquinas_corte" de la base de datos. **/

'use strict';

module.exports = {
    async up(queryInterface) {

        const now = new Date();

        const maquinas = [
            {
                id: '11111111-1111-4111-8111-111111111111',
                codigo: 'SECC-01',
                nombre: 'SECC 1',
                descripcion: 'Seccionadora número 1',
                estado: 'ACTIVO',
                created_at: now,
                updated_at: now,
            },
            {
                id: '22222222-2222-4222-8222-222222222222',
                codigo: 'SECC-02',
                nombre: 'SECC 2',
                descripcion: 'Seccionadora número 2',
                estado: 'ACTIVO',
                created_at: now,
                updated_at: now,
            },
            {
                id: '33333333-3333-4333-8333-333333333333',
                codigo: 'SECC-03',
                nombre: 'SECC 3',
                descripcion: 'Seccionadora número 3',
                estado: 'ACTIVO',
                created_at: now,
                updated_at: now,
            },
            {
                id: '44444444-4444-4444-8444-444444444444',
                codigo: 'SECC-04',
                nombre: 'SECC 4',
                descripcion: 'Seccionadora número 4',
                estado: 'ACTIVO',
                created_at: now,
                updated_at: now,
            },
        ];

        const existing = await queryInterface.sequelize.query(
            `
                SELECT id
                FROM maquinas_corte
                WHERE id IN (:ids)
            `,
            {
                replacements: {
                    ids: maquinas.map((item) => item.id),
                },
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const existingIds = new Set(
            existing.map((item) => item.id)
        );

        const maquinasToInsert = maquinas.filter(
            (item) => !existingIds.has(item.id)
        );

        if (maquinasToInsert.length) {
            await queryInterface.bulkInsert(
                'maquinas_corte',
                maquinasToInsert
            );
        }

    },

    async down(queryInterface) {

        await queryInterface.bulkDelete(
            'maquinas_corte',
            null,
            {}
        );

    },
};

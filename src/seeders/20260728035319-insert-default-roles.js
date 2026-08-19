/** Este archivo es un seeder para insertar roles predeterminados en la tabla de roles de la base de datos. 
    Seeder Se definen tres roles predeterminados: ADMINISTRADOR, SUPERVISOR y OPERARIO. Cada rol tiene un 
    nombre, una descripción y un estado.
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        const roles = [
            {
                nombre: 'ADMINISTRADOR',
                descripcion: 'Acceso completo al sistema',
                estado: true,
            },
            {
                nombre: 'SUPERVISOR',
                descripcion: 'Supervisión de operaciones de la bodega',
                estado: true,
            },
            {
                nombre: 'OPERARIO',
                descripcion: 'Operaciones de almacenamiento y movimiento de materiales',
                estado: true,
            },
        ];

        for (const rol of roles) {

            const [existente] =
                await queryInterface.sequelize.query(
                    `
                    SELECT id
                    FROM roles
                    WHERE nombre = :nombre
                    LIMIT 1
                    `,
                    {
                        replacements: {
                            nombre: rol.nombre,
                        },
                        type: Sequelize.QueryTypes.SELECT,
                    }
                );

            if (!existente) {

                await queryInterface.bulkInsert(
                    'roles',
                    [
                        {
                            nombre: rol.nombre,
                            descripcion: rol.descripcion,
                            estado: rol.estado,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    ]
                );

                console.log(
                    `Rol creado: ${rol.nombre}`
                );

            } else {

                console.log(
                    `Rol ya existente: ${rol.nombre}`
                );
            }
        }
    },

    async down(queryInterface) {

        await queryInterface.bulkDelete(
            'roles',
            {
                nombre: [
                    'ADMINISTRADOR',
                    'SUPERVISOR',
                    'OPERARIO',
                ],
            }
        );
    },
};

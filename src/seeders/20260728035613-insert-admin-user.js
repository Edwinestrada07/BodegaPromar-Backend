/** Este archivo es un seeder que inserta un usuario administrador en la tabla de usuarios de la base de datos. **/

'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface) {
        const roles = await queryInterface.sequelize.query(
            `
            SELECT id
            FROM roles
            WHERE nombre = 'ADMINISTRADOR'
            LIMIT 1
            `,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        if (!roles.length) {
            throw new Error(
                'No existe el rol ADMINISTRADOR. Ejecuta primero el Seeder de roles.'
            );
        }

        const [usuarioExistente] = await queryInterface.sequelize.query(
            `
                SELECT id
                FROM usuarios
                WHERE email = :email
                LIMIT 1
            `,
            {
                replacements: {
                    email: 'admin@bodegapromar.com',
                },
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        if (usuarioExistente) {
            console.log('Usuario administrador ya existe.');
            return;
        }

        const passwordHash = await bcrypt.hash(
            'Admin123*',
            10
        );

        await queryInterface.bulkInsert('usuarios', [
            {
                rol_id: roles[0].id,
                nombre: 'Administrador',
                apellido: 'Sistema',
                email: 'admin@bodegapromar.com',
                password_hash: passwordHash,
                estado: 'ACTIVO',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            'usuarios',
            {
                email: 'admin@bodegapromar.com',
            }
        );
    },
};

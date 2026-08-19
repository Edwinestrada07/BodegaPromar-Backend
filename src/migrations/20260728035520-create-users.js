/** Este archivo es para crear la tabla de usuarios en la base de datos. La tabla contiene información sobre los 
    usuarios del sistema, incluyendo su rol, nombre, apellido, correo electrónico, contraseña y estado.
**/

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('usuarios', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
            },

            rol_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            apellido: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true,
            },

            password_hash: {
                type: Sequelize.STRING(255),
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

            ultimo_acceso: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('usuarios');

        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_usuarios_estado";'
        );
    },
};

/** Este archivo es un repositorio que contiene funciones para interactuar con la tabla de usuarios en la base 
    de datos. 
**/

const { User, Role } = require('../models');

/** Busca un usuario en la base de datos por su correo electrónico. **/
const findByEmail = async (email) => {
    return await User.findOne({
        where: {
            email,
        },
        include: [
            {
                model: Role,
                as: 'rol',
                attributes: [
                    'id',
                    'nombre',
                ],
            },
        ],
    });
};

module.exports = {
    findByEmail,
};
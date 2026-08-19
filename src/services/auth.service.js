/** Este archivo es un servicio de autenticación que contiene la función de inicio de sesión. La función de inicio 
    de sesión verifica las credenciales del usuario y genera un token JWT si las credenciales son válidas.
**/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/user.repository');

const login = async (email, password) => {
    const usuario = await userRepository.findByEmail(email);

    if (!usuario) {
        throw new Error('Correo o contraseña inválidos');
    }

    if (usuario.estado !== 'ACTIVO') {
        throw new Error('El usuario está inactivo');
    }

    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        throw new Error('Correo o contraseña inválidos');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '8h',
        }
    );

    return {
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol.nombre,
        },
        token,
    };
};

module.exports = {
    login,
};
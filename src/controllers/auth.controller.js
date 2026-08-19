/** Este archivo es un controlador que maneja las solicitudes de inicio de sesión de los usuarios. **/

const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const resultado = await authService.login(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: resultado,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            usuario: req.usuario,
        },
    });
};

module.exports = {
    login,
    getCurrentUser,
};
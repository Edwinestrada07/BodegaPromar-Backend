/** Este archivo es para definir las rutas relacionadas con la autenticación de usuarios, como el inicio de sesión.
    Se utiliza el controlador de autenticación para manejar las solicitudes y respuestas de estas rutas.
    Se exporta el router para que pueda ser utilizado en la aplicación principal.
**/

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getCurrentUser);

router.get(
    '/admin-test',
    authenticateToken,
    authorizeRoles('ADMINISTRADOR'),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Acceso autorizado para administrador',
            usuario: req.usuario,
        });
    }
);

module.exports = router;
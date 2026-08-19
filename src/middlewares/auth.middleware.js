/** Este archivo es un middleware que se encarga de autenticar y autorizar a los usuarios que intentan acceder a 
    rutas protegidas en la aplicación. 
**/

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación requerido',
            });
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido',
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
        });
    }
};

const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción',
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
};
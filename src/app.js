/** Configuración de la aplicación Express. Este archivo es el punto de entrada para configurar el servidor Express, incluyendo 
    middlewares como CORS para permitir solicitudes desde diferentes orígenes, Morgan para el registro de solicitudes HTTP, y 
    express.json() para analizar el cuerpo de las solicitudes en formato JSON. Aquí se exporta la instancia de la aplicación Express 
    para ser utilizada en otros archivos, como el archivo de rutas o el archivo principal del servidor.
**/

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const zonaRoutes = require('./routes/zona.routes');
const estanteRoutes = require('./routes/estante.routes');
const nivelRoutes = require('./routes/nivel.routes');
const tipoMaterialRoutes = require('./routes/tipoMaterial.routes');
const colorRoutes = require('./routes/color.routes');
const texturaRoutes = require('./routes/textura.routes');
const materialRoutes = require('./routes/material.routes');
const maquinaCorteRoutes = require('./routes/maquinaCorte.routes');
const movimientoInventarioRoutes = require('./routes/movimientoInventario.routes');
const inventarioRoutes = require('./routes/inventario.routes');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/zonas', zonaRoutes);
app.use('/api/estantes', estanteRoutes);
app.use('/api/niveles', nivelRoutes);
app.use('/api/tipos-material', tipoMaterialRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/texturas', texturaRoutes);
app.use('/api/materiales', materialRoutes);
app.use('/api/maquinas-corte', maquinaCorteRoutes);
app.use('/api/movimientos-inventario', movimientoInventarioRoutes);
app.use('/api/inventarios', inventarioRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API de Gestión de Melamina funcionando correctamente',
    });
});

module.exports = app;
/** Configuración del servidor Express. Este archivo es el punto de entrada principal para iniciar el servidor Express. Aquí se 
    establece la conexión a la base de datos utilizando Sequelize, se sincronizan los modelos con la base de datos, y se inicia el 
    servidor en un puerto específico. Además, se maneja cualquier error que pueda ocurrir durante la conexión a la base de datos o 
    el inicio del servidor. 
**/

require('dotenv').config();

const app = require('./src/app');
const testConnection = require('./src/config/testConnection');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
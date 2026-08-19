/** Archivo de prueba de conexión a la base de datos. Este archivo contiene una función que verifica si la 
    conexión a la base de datos PostgreSQL se ha establecido correctamente. Utiliza Sequelize ORM para 
    autenticar la conexión y proporciona mensajes de éxito o error en la consola según el resultado de la prueba.
**/

const sequelize = require('./database');

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con PostgreSQL:', error.message);
    }
};

module.exports = testConnection;
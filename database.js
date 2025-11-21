const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // Contraseña de mi MySQL
    database: 'node_crud',
    port: '3306'
});

// Verificar si la conexión fue exitosa
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la BD:', error);
        return;
    }
    console.log('Conexión a la BD exitosa');
});

// Exportamos la conexión para usarla en otros archivos
module.exports = connection;
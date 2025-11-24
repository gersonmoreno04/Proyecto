const mysql = require('mysql2');

//CONEXION A LA BASE DE DATOS
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', //CONTRASEÑA DE MI SQL 
    database: 'node_crud',
    port: '3306'
});

//VERIFICAR CONEXION
connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la BD:', error);
        return;
    }
    console.log('Conexión a la BD exitosa');
});
module.exports = connection;
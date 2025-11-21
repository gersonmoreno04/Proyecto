const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// 1. IMPORTAMOS LA LIBRERÍA DE SESIONES (MEMORIA)
const session = require('express-session'); 

// Importamos las rutas separadas
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');

const app = express();

// --- CONFIGURACIONES ---
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');

// Carpeta pública para los estilos CSS
app.use(express.static('public'));

// 2. CONFIGURAMOS LA SESIÓN
// Esto es lo que permite al servidor recordar quién ya inició sesión
app.use(session({
    secret: 'clave_secreta_super_segura', // Puedes poner lo que quieras aquí
    resave: true,
    saveUninitialized: true
}));


// --- RUTAS ---

// Ruta Raíz: Si entras a localhost:3009, te manda al Login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Rutas de Autenticación (Login, Registro, Logout)
app.use('/auth', authRoutes);

// Rutas del Sistema (Tabla, Agregar, Eliminar)
// Aquí es donde aplicaremos la seguridad
app.use('/', crudRoutes);


// --- SERVIDOR ---
const port = 3009;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
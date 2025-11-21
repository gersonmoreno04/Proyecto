const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');

// Importar mis archivos de rutas
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');
const app = express();

// --- Configuraciones ---
// Para entender los datos de los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');

// Carpeta pública para los estilos CSS
app.use(express.static('public'));


// --- Rutas ---

// Redireccionar la raíz al login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Usar las rutas de autenticación (Login y Registro)
app.use('/auth', authRoutes);

// Usar las rutas del CRUD (Tabla de usuarios)
app.use('/', crudRoutes);


// --- Servidor ---
const port = 3009;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
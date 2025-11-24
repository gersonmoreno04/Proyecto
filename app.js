const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//LIBRERIA PARA LAS SESION DE NUESTRO PROYECTO
const session = require('express-session'); 

//IMPORTACION DE RUTAS
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/crud');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: 'CONTRASEÑA', 
    resave: true,
    saveUninitialized: true
}));
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});
app.use('/auth', authRoutes);
app.use('/', crudRoutes);
const port = 3009;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
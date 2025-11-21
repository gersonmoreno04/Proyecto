const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database'); // Importar la conexión

// --- Vistas (GET) ---

// Mostrar el formulario de Login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Mostrar el formulario de Registro
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});


// --- Lógica (POST) ---

// Registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Validar que no falten datos
    if (!username || !email || !password) {
        return res.send('Faltan campos por llenar');
    }

    // Guardar en la base de datos
    const query = 'INSERT INTO login_users SET ?';
    db.query(query, {username, email, password}, (error) => {
        if (error) {
            console.log(error);
            return res.send('Error al registrar usuario');
        }
        // Si se guardó bien, ir al login
        res.redirect('/auth/login');
    });
});

// Iniciar sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Buscar si el usuario y la contraseña coinciden
    const query = 'SELECT * FROM login_users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.send('Error en el servidor');
        }

        // Si encontró un resultado, el login es correcto
        if (results.length > 0) {
            res.redirect('/inicio');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database'); // Tu conexión a la DB

// --- VISTAS (GET) ---

router.get('/login', (req, res) => {
    // Si ya está logueado, lo mandamos directo a inicio
    if (req.session.loggedin) {
        res.redirect('/inicio');
    } else {
        res.sendFile(path.join(__dirname, '../public/login.html'));
    }
});

router.get('/register', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/inicio');
    } else {
        res.sendFile(path.join(__dirname, '../public/register.html'));
    }
});

// --- LÓGICA (POST) ---

// REGISTRO
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) return res.send('Faltan datos');

    const query = 'INSERT INTO login_users SET ?';
    db.query(query, {username, email, password}, (error) => {
        if (error) {
            console.log(error);
            return res.send('Error al registrar (quizás el correo ya existe)');
        }
        res.redirect('/auth/login');
    });
});

// LOGIN (AQUÍ ESTÁ LA MAGIA DE LA SESIÓN)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Buscamos usuario y contraseña
    const query = 'SELECT * FROM login_users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) return res.send('Error de servidor');

        if (results.length > 0) {
            // ¡LOGIN CORRECTO!
            
            // 1. GUARDAMOS EN MEMORIA QUE YA ENTRÓ
            req.session.loggedin = true;
            req.session.name = username; // Guardamos el nombre para saludarlo

            console.log(`Sesión iniciada para: ${username}`);
            res.redirect('/inicio');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

// CERRAR SESIÓN (LOGOUT)
router.get('/logout', (req, res) => {
    // Destruimos la memoria de la sesión
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
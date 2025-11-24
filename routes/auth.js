const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database'); // CONEXION A LA BASE DE DATOS

router.get('/login', (req, res) => {
    // CONDICION DEL LOG IN
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

// METODO DE REGISTRO DE USUARIO
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

// METODO DE LOG IN
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    //PREGUNTAMOS POR EL USUARIO Y CONTRASEÑA
    const query = 'SELECT * FROM login_users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) return res.send('Error de servidor');

        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.name = username;

            console.log(`Sesión iniciada para: ${username}`);
            res.redirect('/inicio');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

// METODO PARA CERRAR SESION
router.get('/logout', (req, res) => {
    //REINICIAMOS LA MEMORIA
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
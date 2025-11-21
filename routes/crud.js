const express = require('express');
const router = express.Router();
const db = require('../database');

// --- MIDDLEWARE DE SEGURIDAD (EL GUARDIA) ---
const verificarSesion = (req, res, next) => {
    if (req.session.loggedin) {
        // Si tiene permiso, pásale
        next();
    } else {
        // Si no tiene permiso, ¡Vete al Login!
        res.redirect('/auth/login');
    }
};

// --- RUTAS PROTEGIDAS ---
// Nota: Todas llevan 'verificarSesion' antes de la función

// Mostrar Tabla (Ruta protegida)
router.get('/inicio', verificarSesion, (req, res) => {
    const consulta = 'SELECT * FROM users';
    
    db.query(consulta, (err, results) => {
        if (err) {
            res.send('Error consultando datos');
        } else {
            // Renderizamos pasando los usuarios Y el nombre de la sesión
            res.render('index', { 
                users: results,
                name: req.session.name 
            });
        }
    });
});

// Agregar Usuario (Protegida)
router.post('/add', verificarSesion, (req, res) => {
    const { name, email } = req.body;
    const consulta = 'INSERT INTO users (name, email) VALUE (?,?)';
    db.query(consulta, [name, email], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

// Vista de Editar (Protegida)
router.get('/edit/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const consulta = 'SELECT * FROM users WHERE id = ?';
    db.query(consulta, [id], (err, results) => {
        if(err) console.log(err);
        res.render('edit', { user: results[0] });
    });
});

// Actualizar (Protegida)
router.post('/update/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const consulta = 'UPDATE users SET name=?, email=? WHERE id=?';
    db.query(consulta, [name, email, id], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

// Eliminar (Protegida)
router.get('/delete/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const consulta = 'DELETE FROM users Where id=?';
    db.query(consulta, [id], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../database');
const verificarSesion = (req, res, next) => {
    if (req.session.loggedin) {
        //CONDICIONAMOS EL ACCESO
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Mostrar Tabla
router.get('/inicio', verificarSesion, (req, res) => {
    const consulta = 'SELECT * FROM users';
    
    db.query(consulta, (err, results) => {
        if (err) {
            res.send('Error consultando datos');
        } else {
            res.render('index', { 
                users: results,
                name: req.session.name 
            });
        }
    });
});

// METODO PARA AGREGAR USUARIO
router.post('/add', verificarSesion, (req, res) => {
    const { name, email } = req.body;
    const consulta = 'INSERT INTO users (name, email) VALUE (?,?)';
    db.query(consulta, [name, email], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

//METODO PARA EDITAR
router.get('/edit/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const consulta = 'SELECT * FROM users WHERE id = ?';
    db.query(consulta, [id], (err, results) => {
        if(err) console.log(err);
        res.render('edit', { user: results[0] });
    });
});

//METODO PARA ACTUALIZAR
router.post('/update/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const consulta = 'UPDATE users SET name=?, email=? WHERE id=?';
    db.query(consulta, [name, email, id], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

//METODO PARA ELIMINAR
router.get('/delete/:id', verificarSesion, (req, res) => {
    const { id } = req.params;
    const consulta = 'DELETE FROM users Where id=?';
    db.query(consulta, [id], (err) => {
        if(err) console.log(err);
        res.redirect('/inicio');
    });
});

module.exports = router;
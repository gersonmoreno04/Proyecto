const express = require('express');
const router = express.Router();
const db = require('../database'); // Usamos la misma conexión

// Ruta principal: Mostrar la tabla de usuarios
router.get('/inicio', (req, res) => {
    const consulta = 'SELECT * FROM users';
    
    db.query(consulta, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.send('Error al obtener datos');
        } else {
            // Mandar los datos a la vista index.ejs
            res.render('index', { users: results });
        }
    });
});

// Agregar un usuario nuevo (CRUD)
router.post('/add', (req, res) => {
    const { name, email } = req.body;
    const consulta = 'INSERT INTO users (name, email) VALUE (?,?)';
    
    db.query(consulta, [name, email], (err) => {
        if (err) {
            res.send('Error al guardar usuario');
        } else {
            res.redirect('/inicio');
        }
    });
});

// Mostrar formulario para editar
router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const consulta = 'SELECT * FROM users WHERE id = ?';
    
    db.query(consulta, [id], (err, results) => {
        if (err) {
            res.send('Error al buscar usuario');
        } else {
            res.render('edit', { user: results[0] });
        }
    });
});

// Actualizar los datos del usuario
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const consulta = 'UPDATE users SET name=?, email=? WHERE id=?';
    
    db.query(consulta, [name, email, id], (err) => {
        if (err) {
            res.send('Error al actualizar');
        } else {
            res.redirect('/inicio');
        }
    });
});

// Eliminar un usuario
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const consulta = 'DELETE FROM users Where id=?';
    
    db.query(consulta, [id], (err) => {
        if (err) {
            res.send('Error al eliminar');
        } else {
            res.redirect('/inicio');
        }
    });
});

module.exports = router;
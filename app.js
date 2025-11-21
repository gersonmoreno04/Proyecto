const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// uso de expres para solicitudes
const app = express();
//Analizar los datos del cuerpo del formulario que viene desde el html
//Informacion que mandaremos por metodos como POST o GET
app.use(bodyParser.urlencoded({extends:false}));
//Configuracion de el motor de plantillas
app.set('view engine','ejs');

// configuracion de la DB
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'123456',
    database:'node_crud',
    port: '3306'
});
//validacion de db
db.connect(err=>{
    if(err){
        console.error(' server llama',err);
    }
    else{
        console.log('server no llama feliz');
    }
});

//Mostrar lista de usuarios
app.get('/',(req,res)=>{
    //consulta
    const consulta = 'SELECT * FROM users';
    db.query(consulta,(err,results)=>{
        if(err){
            console.error('error en la consulta',err);
            res.send('Error no se pueden recuperar datos');
        }else{
            res.render('index',{users: results});
        }
    });
})

//Agregar usuario
app.post('/add',(req,res)=>{
    const {name, email} =req.body;

    const consulta = 'INSERT INTO users (name, email) VALUE (?,?)';
    db.query(consulta,[name, email],(err)=>{
        if(err){
            console.error('Error al agregar usuario',err);
            res.send('Error al usuario');
        }else{
            res.redirect('/');
        }
    });
});

//Editar
app.get('/edit/:id',(req,res)=>{
    const {id} =req.params;
    const consulta = 'SELECT * FROM users WHERE id = ?';
    db.query(consulta,[id],(err,results)=>{
        if(err){
            console.error('Error al encontrar el ID',err);
            res.send('error');
        }else{
            res.render('edit',{user:results[0]});
        }
    });
});

// actualizar
app.post('/update/:id',(req,res)=>{
    const {id} = req.params;
    const {name, email} = req.body;
    const consulta = 'UPDATE users SET name=?, email=? WHERE id=?';
    db.query(consulta,[name,email,id],(err)=>{
        if(err){
            console.error('Error al actualizar registros',err);
            res.send('Error al actualizar registros');
        }else{
            res.redirect('/');
        }
    })
});

// eliminar 
app.get('/delete/:id',(req,res)=>{
    const {id} = req.params;
    const consultaElimina = 'DELETE FROM users Where id=?';
    db.query(consultaElimina,[id],(err)=>{
        if(err){
            console.error('Error al eliminar registros',err);
            res.send('Error al eliminar registros');
        }else{
            res.redirect('/');
        }
    })
});

app.use(express.static('public'));

//servidor
const port = 3009;
app.listen(port,()=>{
    console.log(`server desde http://127.0.0.1:${port}`)
})
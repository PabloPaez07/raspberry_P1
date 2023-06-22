const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const port = 3000;

const leerMQTT = require('./public/funciones/leerMQTT');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pagina_principal.ejs', {
        root:__dirname
    })
})

app.get('/informacion', (req, res) => {
    res.render('informacion.ejs', {
        root:__dirname
    })
})

app.get('/aplicacion', (req, res) => {
    res.render('aplicacion.ejs', {
        root:__dirname,
        helper: leerMQTT,
        cliente: client
    });
})

app.get('/contacto', (req, res) => {
    res.render('contacto.ejs', {
        root:__dirname
    })
})   

app.listen(port);
console.log(`Server on port ${port}`);


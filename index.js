const express = require('express');
const app = express();
const mqtt = require('mqtt');
const fs = require('fs');
const ejs = require('ejs');
const port = 3000;

const leerMQTT = require('./public/funciones/leerMQTT');

app.use(express.static('public'));
app.set('view engine', 'ejs');

const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8);
const username = 'RaspberryPablo';
const password = 'anv64ahx';

const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt',{
    clientId,
    username,
    password,
    reconnectPeriod: 1000
});

client.on('connect', function()
{
    console.log('conectado a broker mqtt');
    client.subscribe('habitacion/1'), function (error)
    {
        if(error)
        {
            console.log('error conectando a habitacion/1');
            return;
        }else{
            client.publish('habitacion/1',"Hola: soy raspberryPi",0);
        }
    }
});

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


const express = require('express');
const app = express();
const mqtt = require('mqtt');
const GPIO = require('rpi-gpio');
const fs = require('fs');
const ejs = require('ejs');
const port = 3000;

const leerMQTT = require('./public/funciones/leerMQTT');

app.use(express.static('public'));
app.set('view engine', 'ejs');

GPIO.setMode('mode_bcm');
GPIO.setup(17,'out');
GPIO.setup(27,'out');
GPIO.setup(22,'out');
GPIO.setup(5,'out');
GPIO.setup(6,'out');

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

app.get('/aplicacion/luces/:num_boton/:estado', (req, res) => {
    switch(req.params.num_boton)
    {
        case "1":
            client.publish('topic_luces', 'Enciendo habitacion 1')
            GPIO.output(17,(req.params.estado == "1"));
        break;
        case "2":
            client.publish('topic_luces', 'Enciendo habitacion 2')
            GPIO.output(27,(req.params.estado == "1"));
        break;
        case "3":
            client.publish('topic_luces', 'Enciendo habitacion 3')
            GPIO.output(22,(req.params.estado == "1"));
        break;
        case "4":
            client.publish('topic_luces', 'Enciendo habitacion 3')
            GPIO.output(5,(req.params.estado == "1"));
        break;
        case "5":
            client.publish('topic_luces', 'Enciendo habitacion 3')
            GPIO.output(6,(req.params.estado == "1"));
        break;
        default:
            return 0;
        break;
    }
})

app.get('/datos', (req, res) => {
    // Aquí puedes obtener los nuevos datos desde tu broker MQTT o desde cualquier otra fuente de datos
    const nuevosDatos = obtenerNuevosDatos();
    res.json({ datos: nuevosDatos });
    });    

app.listen(port);
console.log(`Server on port ${port}`);


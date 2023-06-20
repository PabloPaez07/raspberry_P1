const express = require('express');
const app = express();
const server = require('http').Server(app);
const socketio = require('socket.io')(server);
const mqtt = require('mqtt');
const GPIO = require('rpi-gpio');
const fs = require('fs');
const port = 3000;
eServer(app);

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
        root:__dirname
    });
})

app.get('/contacto', (req, res) => {
    res.render('contacto.ejs', {
        root:__dirname
    })
})

app.get('/aplicacion/luces/:num_boton/:estado', (req, res) => {
    var client = mqtt.connect('tcp://test.mosquitto.org');
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

const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt',{
    clientId,
    username,
    password,
    reconnectPeriod: 1000
});

client.on('connect', function()
            {
                console.log('conectado a broker mqtt');
                client.subscribe('topic_luces', function (error)
                {
                    if(error)
                    {
                        console.log('error conectando a topic_luces');
                        return;
                    }else{
                        client.publish('topic_luces',"Hola: soy raspberryPi",0);
                    }
                })
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

var resultado;
var temperatura;
var humedad;
var sensacion_termica;
client.on('message', function(topic, message, packet){

    if(topic === "habitacion/1")
    {
        resultado = JSON.parse(message);
        console.log(resultado);
        temperatura = resultado['Temperatura'];
        humedad = resultado['Humedad'];
        sensacion_termica = temperatura + 0.348 * (humedad/100 * 6.105 * Math.pow(Math.E,(17.27*temperatura/(237.7+temperatura)))) - 4.25;
        console.log(`Sensación térmica: ${sensacion_termica}`);
    }
    
})

io.on('connection', function (socket){
    console.log('conexion socket');
    setInterval(function (){
        socket.emit('update-value',temperatura);
    }, 1000);
});

app.listen(port);
console.log(`Server on port ${port}`);

server.listen(8080, () => {
    console.log(`Servidor en el puerto 8080`);
})


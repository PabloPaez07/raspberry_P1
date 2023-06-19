const express = require('express');
const app = express();
const mqtt = require('mqtt');
const GPIO = require('rpi-gpio');
const fs = require('fs');
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

GPIO.setMode('mode_bcm');
GPIO.setup(17,'out');
GPIO.setup(27,'out');
GPIO.setup(22,'out');
GPIO.setup(5,'out');
GPIO.setup(6,'out');

const client = mqtt.connect('broker.emqx.io:1833',{
    clean: true,
    connectTimeout: 4000,
    username: 'RaspberryPablo',
    password: 'anv64ahx',
    reconnectPeriod: 1000,
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
        root:__dirname
    });
})

app.get('/contacto', (req, res) => {
    res.render('contacto.ejs', {
        root:__dirname
    })
})

client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(error)
                    {
                        console.log('error conectando a topic_luces');
                    }else{
                        client.publish('topic_luces',"Hola: soy raspberryPi");
                    }
                })
                client.subscribe('habitacion/1'), function (error)
                {
                    if(error)
                    {
                        console.log('error conectando a habitacion/1');
                    }else{
                        client.publish('topic_luces',"Hola: soy raspberryPi");
                    }
                }
            });

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

client.on('message', function(topic, message, packet){
    console.log("Topic is "+topic);
    console.log("Message is "+message);
    console.log("Packet is "+JSON.stringify(packet));
})

app.listen(port);
console.log(`Server on port ${port}`);


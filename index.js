const express = require('express');
const app = express();
const mqtt = require('mqtt');
const GPIO = require('rpi-gpio');
const dht = require('node-dht-sensor');
app.use(express.static('public'));
app.set('view engine', 'ejs');
GPIO.setMode('mode_bcm');
GPIO.setup(17,'out');
GPIO.setup(27,'out');
GPIO.setup(22,'out');
GPIO.setup(5,'out');
GPIO.setup(6,'out');


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
            client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(!error)
                    {
                        client.publish('topic_luces', 'Enciendo habitacion 1')
                    }
                })
            })
            GPIO.output(17,(req.params.estado == "1"));
        break;
        case "2":
            client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(!error)
                    {
                        client.publish('topic_luces', 'Enciendo habitacion 2')
                    }
                })
            })
            GPIO.output(27,(req.params.estado == "1"));
        break;
        case "3":
            client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(!error)
                    {
                        client.publish('topic_luces', 'Enciendo habitacion 3')
                    }
                })
            })
            GPIO.output(22,(req.params.estado == "1"));
        break;
        case "4":
            client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(!error)
                    {
                        client.publish('topic_luces', 'Enciendo habitacion 3')
                    }
                })
            })
            GPIO.output(5,(req.params.estado == "1"));
        break;
        case "5":
            client.on('connect', function()
            {
                client.subscribe('topic_luces', function (error)
                {
                    if(!error)
                    {
                        client.publish('topic_luces', 'Enciendo habitacion 3')
                    }
                })
            })
            GPIO.output(6,(req.params.estado == "1"));
        break;
        default:
            return 0;
        break;
    }
})

app.get('/aplicacion/temp', (req,res)=>{
    dht.read(11, 26, function(err, temperature, humidity) {
    if (!err) {
        console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
    }
    });

    res.render('aplicacion.ejs', {
        root:__dirname
    });
})


app.listen(3000);
console.log('Server on port ${3000}');


const express = require('express');
const app = express();
const mqtt = require('mqtt');
const GPIO = require('rpi-gpio');

app.use(express.static('public'));
app.set('view engine', 'ejs');
GPIO.setMode('mode_bcm');
GPIO.setup(17,'out');
GPIO.setup(27,'out');
GPIO.setup(22,'out');

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
    GPIO.output(17,false);
    GPIO.output(22,false);
    GPIO.output(27,false);
    res.render('contacto.ejs', {
        root:__dirname
    })
})

app.get('/aplicacion/luces/:num_boton', (req, res) => {
    var client = mqtt.connect('tcp://test.mosquitto.org');
    switch(req.params.num_boton)
    {
        case "1":
            console.log('enciendo luz 1');
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
            GPIO.output(17,true);
        break;
        case "2":
            console.log('enciendo luz 2');
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
            GPIO.output(27,true);
        break;
        case "3":
            console.log('enciendo luz 3');
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
            GPIO.output(22,true);
        break;
        default:
            return 0;
        break;
    }
})

app.listen(2000);
console.log('Server on port ${3000}');


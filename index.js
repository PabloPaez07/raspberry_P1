const express = require('express');
const GPIO = require('rpi-gpio');
const app = express();

GPIO.setMode(GPIO.MODE_BCM);
GPIO.setup(18, GPIO.DIR_OUT);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('./vistas/pagina_principal.html', {
        root:__dirname
    })
})

app.get('/informacion', (req, res) => {
    GPIO.output(18,true);
    res.sendFile('./vistas/informacion.html', {
        root:__dirname
    })
})

app.get('/aplicacion', (req, res) => {
    GPIO.output(18,false);
    res.sendFile('./vistas/aplicacion.html', {
        root:__dirname
    });
})

app.get('/contacto', (req, res) => {
    console.log('apago_led');
    res.sendFile('./vistas/contacto.html', {
        root:__dirname
    })
})

app.listen(3000);
console.log('Server on port ${3000}');


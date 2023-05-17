const express = require('express');
const Gpio = require('rpi-gpio');

Gpio.setMode(Gpio.MODE_RPI);
Gpio.setup(18, Gpio.DIR_OUT);

Gpio.output(18,0);
const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    Gpio.output(18,0);
    res.sendFile('./vistas/pagina_principal.html', {
        root:__dirname
    })
})

app.get('/informacion', (req, res) => {
    res.sendFile('./vistas/informacion.html', {
        root:__dirname
    })
})

app.get('/aplicacion', (req, res) => {
    Gpio.output(18,1);
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


const express = require('express');
const Gpio = require('onoff').Gpio;

const LED = new Gpio(1,'out');

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    console.log('apago_led');
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
    LED.write(1);
    console.log('enciendo_led');
    res.sendFile('./vistas/aplicacion.html', {
        root:__dirname
    });
})

app.get('/contacto', (req, res) => {
    LED.write(0);
    console.log('apago_led');
    res.sendFile('./vistas/contacto.html', {
        root:__dirname
    })
})

app.listen(3000);
console.log('Server on port ${3000}');


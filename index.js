const express = require('express');
const Gpio = require('onoff').Gpio;

const LED = new Gpio(18,'out');

const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    LED.write(0);
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
    res.sendFile('./vistas/aplicacion.html', {
        root:__dirname
    });
})

app.get('/contacto', (req, res) => {
    LED.write(0);
    res.sendFile('./vistas/contacto.html', {
        root:__dirname
    })
})

app.listen(3000);
console.log('Server on port ${3000}');


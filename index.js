const express = require('express');
const GPIO = require('rpio');
const app = express();

GPIO.open(18, GPIO.OUTPUT, GPIO.LOW);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile('./vistas/pagina_principal.html', {
        root:__dirname
    })
})

app.get('/informacion', (req, res) => {
    GPIO.write(18, GPIO.HIGH);
    res.sendFile('./vistas/informacion.html', {
        root:__dirname
    })
})

app.get('/aplicacion', (req, res) => {
    GPIO.write(18, GPIO.LOW);
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


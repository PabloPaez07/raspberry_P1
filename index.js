// ----------------- Librerías del proyecto ---------------------------------
    const express = require('express');
    const mqtt = require('mqtt');
    const GPIO = require('rpi-gpio');
    const fs = require('fs');
    const ejs = require('ejs');
    const { exec } = require('child_process');
    const { json } = require('body-parser');

// ---------------- inicialización del framework express ----------------------
    const app = express();

// ------------------- Referencia a la carpeta public -------------------------
    app.use(express.static('public'));

// ------------------- Generador de vistas ------------------------------------
    app.set('view engine', 'ejs');

// ------------------- Configuración del broker MQTT --------------------------
    const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8);
    const username = 'RaspberryPablo';
    const password = 'botella';

    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt',{
        clientId,
        username,
        password,
        reconnectPeriod: 1000
    });

// --------------- Configuración de referencia de pines -------------------------
// en el modo BCM llamaremos directamente en la función al número de Pin GPIO que corresponda
    GPIO.setMode('mode_bcm');
    
// ---------------- Configuración de puertos GPIO -------------------------------
// este pin se utiliza para apagar la raspberryPi
    const pinBoton = 26;
    const tiempo_para_encender = 3000;
    GPIO.setup(pinBoton, GPIO.DIR_IN, GPIO.EDGE_BOTH);
// estos puertos se utilizarán para el control de los relés que encienden y apagan las bombillas
    GPIO.setup(17,'out');
    GPIO.setup(27,'out');
    GPIO.setup(22,'out');
    GPIO.setup(5,'out');
    GPIO.setup(6,'out');
    GPIO.setup(16, 'out');

// ---------------------------------- Routing -----------------------------------

    //página principal
    app.get('/', (req, res) => {
        res.render('pagina_principal.ejs', {
            root:__dirname
        })
    })

    //página de información
    app.get('/informacion', (req, res) => {
        res.render('informacion.ejs', {
            root:__dirname
        })
    })

    //página de aplicación
    app.get('/aplicacion', (req, res) => {
        res.render('aplicacion.ejs', {
            root:__dirname,
            cliente: client
        });
    })

    //página de contacto
    app.get('/contacto', (req, res) => {
        res.render('contacto.ejs', {
            root:__dirname
        })
    })

    //enlace para controlar la iluminación
    var estados = [0,0,0,0,0];
    var gpios_luz = [17, 27, 22, 5, 6];
    app.get('/aplicacion/luces/:num_habitacion', (req, res) => {
        if(estados[req.params.num_habitacion] === 0)
        {
            estados[req.params.num_habitacion] = 1;
            GPIO.output(gpios_luz[req.params.num_habitacion],true);
        }
        else
        {
            estados[req.params.num_habitacion] = 0;
            GPIO.output(gpios_luz[req.params.num_habitacion],false);
        }
    });

    //enlace para activar la alarma
    app.get('/alarma/gases',(req, res)=>{
        try {
            // Activar el pin
            GPIO.output(16, true);
    
            // Mantener el pin activo durante 500 ms
            setTimeout(() => {
                // Desactivar el pin después de 500 ms
                GPIO.output(16, false);
    
                // Enviar respuesta JSON después de desactivar el pin
                res.json({ status: 'success', message: 'Alarma activada por gases' });
            }, 500);
        } catch (error) {
            console.error('Error al activar la alarma:', error);
            res.status(500).json({ status: 'error', message: 'Error al activar la alarma' });
        }
    });

    //Evento de apagado de la raspberryPi
    /*GPIO.on('change', (channel, value) => {
        if (channel === pinBoton && value === false) {
            exec('sudo poweroff');
        }
    });*/

    let estado_encendida = true; // La Raspberry Pi comienza encendida
    let ultima_activacion = 0; // Variable para almacenar el tiempo de la última activación
    
    GPIO.on('change', (channel, value) => {
        if (channel === 26) {
            const tiempo_actual = Date.now();
            if (tiempoActual - ultima_activacion < 200) {
                return;
            }
            ultima_activacion = tiempo_actual;
            if (estado_encendida) {
                GPIO.output(17, false); // Apaga la Raspberry Pi
            } else {
                GPIO.output(17, true); // Enciende la Raspberry Pi
            }
            estado_encendida = !estado_encendida; // Invierte el estado
        }
    });

    //ejecución del programa
    const port = 3000;
    app.listen(port);
    console.log(`Server on port ${port}`);


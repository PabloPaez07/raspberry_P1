module.exports ={
    leerTemperatura()
    {
        const mqtt = require('mqtt');
        const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8);
        const username = 'RaspberryPablo';
        const password = 'anv64ahx';
    
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt',{
            clientId,
            username,
            password,
            reconnectPeriod: 1000
        });
    
        client.on('connect', function()
        {
            console.log('conectado a broker mqtt');
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

        return temperatura;
    }
}

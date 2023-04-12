var mqtt = require('mqtt')


//var client  = mqtt.connect('mqtt://10.30.50.29')
        
const client = mqtt.connect('mqtt://10.30.50.29', {
    username: 'pdelam01',
    password: 'pass1'
})

client.on('connect', function () {
  client.subscribe('telemetry/sensor', function (err) {
    if (!err) {
      client.publish('telemetry/sensor', "{\"humidity\":0,\"temperature\":0}")
    }
  })
})


//Credenciales de acceso: usuario y contraseña

client.on('message', function (topic, message) {
    var data= JSON.parse(message.toString())
   
    //console.log(data.temperature)
    console.log("temperatura: "+data.temperature);
    console.log("humedad: "+data.humidity);
  
})

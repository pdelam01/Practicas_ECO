const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const httpServer = require('http').createServer()
const ws = require('websocket-stream')



ws.createServer({ server: httpServer }, aedes.handle)

const port = 1883
const wsPort = 3000

aedes.on('clientConnected', function (client) {
    console.log('\n -Cliente conectado: ' + client.id)
})

aedes.authenticate = function (client, username, password, callback) {
    if (username === 'pdelam01' && password.toString() === 'pass1') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}


aedes.on('publish', function (packet, client) {
    if (client !== undefined) {
        console.log('\n -Nuevo mensaje')
        console.log(' -Topic: ' + packet.topic)
        console.log(' -Mensaje: ' + packet.payload.toString())
    }

})

aedes.on('subscribe', function (topic, client) {
    console.log(' \n -El cliente: ' + client.id)
    console.log(' -suscrito a: ')
    console.log(topic)
})

server.listen(port, function () {
    console.log('Broker MQTT en el puerto: ' + port)
})

httpServer.listen(wsPort, function () {
    console.log('Broker MQTT por websockets en el puerto: ' + wsPort)
})

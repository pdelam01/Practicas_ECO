var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var Device = require('./models/device');
var app = express();

var fs = require('fs');
var https = require('https');

var options={
    key: fs.readFileSync('SSL/apirest.key'),
    cert: fs.readFileSync('SSL/apirest.crt'),
    passphrase :'ejemplo'
};

var authCtrl = require('./auth/auth');
var middleware = require('./auth/middleware');

const mongoSanitize = require('mongo-sanitize');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//var port = 9000;
var port = 443;
var database = 'mongodb://127.0.0.1/demoAPIREST';
mongoose.set('strictQuery', false);
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(" -Mongodb conectado: " + database);
});

app.get('/devices/', function (req, res) {
    res.json({
        msg: '¡el API REST funciona!'
    });
});

//peticion GET para obtener los datos de un dispositivo por su tipo
app.get('/devices/:type', middleware.ensureAuthenticated, function (req, res) {
    console.log(JSON.stringify(req.params, null, 2));
    // Se busca con un filtro por ejemplo {"type": "temperature"} y comprueba errores
    Device.find(req.params, function (err, device) {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });
});
   

//peticion post para añadir un dispositivo
app.post('/devices/', function (req, res) {
    // Se crea una instancia del modelo device
    var device = new Device(req.body);
    console.log(JSON.stringify(req.body, null, 2));
    // se toma el objeto json de req body
    // Se almacena y comprueba errores
    device.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'Dispositivo añadido'
        });
    });
});

//Peticion PUT para atualizar los datos de un dispositivo
app.put('/devices/:type', function (req, res) {
    console.log('-Dispositivo a actualizar');
    console.log(JSON.stringify(req.params, null, 2));
    Device.findOne(req.params, function (err, device) {
        if (err) {
            res.send(err);
        } else {
            device.value = req.body.value;
            console.log('-Dato actualizado');
            console.log(JSON.stringify(device, null, 2));
            device.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({
                        message: 'valor del dispositivo actualizado!'
                    });
                }
            });
        }
    });
});

//eliminar un dispositivo por su tipo
app.delete('/devices/:type', function (req, res) {
    console.log('DELETE /devices/find');
    Device.deleteOne(req.params, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'dispositivo eliminado' });
        }
    });
});



//peticion post para buscar dispositivos
app.post('/devices/find', function (req, res) {
    console.log('POST /devices/find');
    console.log(JSON.stringify(req.body, null, 2));
    Device.find({'type':mongoSanitize(req.body.type)}, function (err, device) {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });
});

// ================================================ Practica 2




//Ruta para realizar la autenticación por post ‘auth/login’
app.post('/auth/login', authCtrl.aliasLogin);



// ================================================
/*app.listen(port, function () {
    console.log('servidor node.js funcionando en el puerto: ' + port);
});*/

https.createServer(options, app).listen(port, function () {
    console.log('servidor node.js funcionando en el puerto: ' + port);
});
   
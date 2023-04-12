const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DeviceSchema = new Schema({
    type: String,
    name: String,
    description: String,
    unit: String,
    value: Number
});

// importante el nombre de la coleccion en SINGULAR
module.exports = mongoose.model('device', DeviceSchema);
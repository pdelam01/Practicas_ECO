const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
 alias: String,
 pass: String
});

// Importante el nombre de la colección en SINGULAR
module.exports = mongoose.model('user', UserSchema);
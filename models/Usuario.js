const {Schema, model } = require('mongoose');

const usuarioShema = new Schema({
    nombre: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    estado: {type: String, required:true, enum: ['Activo', 'Inactivo']},
    fechaCreacion: {type: Date, default: Date.now},
    fechaActualizacion: {type: Date, default: Date.now}
});

module.exports = model('Usuario', usuarioShema);
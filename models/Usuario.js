const {Schema, model } = require('mongoose');


const UsuarioSchema = new Schema({
    nombre: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    estado: {type: String, required:true, enum: ['Activo', 'Inactivo']},
    password: {type: String, require: true},
    rol: {type: String, require: true, enum: ['Administrador', 'Docente']},
    fechaCreacion: {type: Date, default: Date.now},
    fechaActualizacion: {type: Date, default: Date.now}         
});


module.exports = model('Usuario', UsuarioSchema);
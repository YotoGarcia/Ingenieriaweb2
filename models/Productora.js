const {Schema, model } = require('mongoose');

const productoraSchema = new Schema({
    nombre: {type: String, required:true},
    estado: {type: String, required:true, enum: ['Activo', 'Inactivo']}, 
    fechaCreacion: {type: Date, default: Date.now},
    fechaActualizacion: {type: Date, default: Date.now},
    slogan: {type: String},
    descripcion: {type: String},
});


module.exports = model('Productora', productoraSchema);
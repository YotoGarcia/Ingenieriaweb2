const {Schema, model } = require('mongoose');

const tipoSchema = new Schema({
    nombre: {type: String, required:true},
    descripcion: {type: String, required:true},
    fechaCreacion: {type: Date, default: Date.now},
    fechaActualizacion: {type: Date, default: Date.now}
});


module.exports = model('Tipo', tipoSchema);
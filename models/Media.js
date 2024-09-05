const {Schema, model } = require('mongoose');



const mediaSchema = new Schema({
    serial: {type: Number, require: true, unique: true },
    titulo: {type: String, required:true},
    sipnosis: {type: String, required:true, unique: true},
    url: {type: String, required:true, },
    imagen: {type: String},
    fechaCreacion: {type: Date, default: Date.now},
    fechaActualizacion: {type: Date, default: Date.now},
    añoEstreno: {type: Number},
    genero: {type: Schema.Types.ObjectId, ref: 'Genero', require: true},
    director: {type: Schema.Types.ObjectId, ref: 'Director', require: true},
    productora: {type: Schema.Types.ObjectId, ref: 'Productora', require: true},
    tipo: {type: Schema.Types.ObjectId, ref: 'Tipo', require: true},

});


module.exports = model('Media', mediaSchema);
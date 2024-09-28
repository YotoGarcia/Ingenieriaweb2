const { Schema, model } = require('mongoose');


const mediaSchema = new Schema({
    serial: { type: Number, required: true, unique: true },
    titulo: { type: String, required: true },
    sinopsis: { type: String },
    url: { type: String, required: true },
    imagen: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now },
    añoEstreno: { type: Number },
    genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
    director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
});


mediaSchema.pre('save', function(next) {
    this.fechaActualizacion = Date.now(); 
    next();
});


module.exports = model('Media', mediaSchema);

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Productora = require('../models/Productora.js');


//Metodo llamar

router.get('/', async function(req, res){
    try{
        const productora = await Productora.find();
        res.status(200).json(productora);
    } catch(error){
        console.log('Error al obtener Productora', error);
        res.status(500).send('ocuarrio un error')
    }
});

//Metodo crear

router.post('/', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),

], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const { nombre, estado } = req.body; 

        const nuevaProductora = new Productora({nombre, estado});
        const productoraGuardada = await nuevaProductora.save()

        res.status(201).json(productoraGuardada);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear la Productora')
    }
    
});

//Metodo actualizar

router.put('/:productoraId', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
   
        if (!mongoose.Types.ObjectId.isValid(req.params.productoraId)) {
            return res.status(400).send('ID de Productora no válido');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let productora = await Productora.findById(req.params.productoraId);
        if (!productora) {
            return res.status(404).send('Productora no existe');
        }

        const { nombre, estado } = req.body;

        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }

        productora.nombre = nombre;
        productora.estado = estado;
        productora.fechaActualizacion = new Date();


        const productoraActualizado = await productora.save();
        res.send(productoraActualizado);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar Productora');
    }
});

//Metodo Eliminar

 router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const productoraEliminado = await Productora.findByIdAndDelete(id);

        if (!productoraEliminado){
            return res.status(404).send('Productora no encontrado');
        }

        res.send('Productora eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar Productora');
    }
 })

module.exports = router;
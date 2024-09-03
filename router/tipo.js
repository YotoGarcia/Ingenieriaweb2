const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Tipo = require('../models/Tipo.js');


//Metodo llamar

router.get('/', async function(req, res){
    try{
        const tipo = await Tipo.find();
        res.status(200).json(tipo);
    } catch(error){
        console.log('Error al obtener Tipo', error);
        res.status(500).send('Ocurrio un error')
    }
});

//Metodo crear

router.post('/', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('descripcion', 'descripcion inválida').not().isEmpty(),

], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const { nombre, descripcion } = req.body; 

        const nuevoTipo = new Tipo({nombre, descripcion});
        const tipoGuardado = await nuevoTipo.save()

        res.status(201).json(tipoGuardado);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el Tipo')
    }
    
});

//Metodo actualizar

router.put('/:tipoId', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('descripcion', 'Descripcion inválida').not().isEmpty(),
], async function(req, res) {
    try {
   
        if (!mongoose.Types.ObjectId.isValid(req.params.tipoId)) {
            return res.status(400).send('ID de Tipo no válido');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let tipo = await Tipo.findById(req.params.tipoId);
        if (!tipo) {
            return res.status(404).send('Tipo no existe');
        }

        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }

        tipo.nombre = nombre;
        tipo.descripcion = descripcion;
        tipo.fechaActualizacion = new Date();


        const tipoActualizado = await tipo.save();
        res.send(tipoActualizado);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el Tipo');
    }
});

//Metodo Eliminar 

 router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const tipoEliminado = await Tipo.findByIdAndDelete(id);

        if (!tipoEliminado){
            return res.status(404).send('Tipo no encontrado');
        }

        res.send('Tipo eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar al Tipo');
    }
 })

module.exports = router;
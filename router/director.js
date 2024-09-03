const express = require('express');
const router = express.Router();
const director = require('../models/Director');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Director = require('../models/Director');


//Metodo llamar

router.get('/', async function(req, res){
    try{
        const director = await Director.find();
        res.status(200).json(director);
    } catch(error){
        console.log('Error al obtener directores', error);
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

        const nuevoDirector = new Director({nombre, estado});
        const directorGuardado = await nuevoDirector.save()

        res.status(201).json(directorGuardado);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el director')
    }
    
});

//Metodo actualizar

router.put('/:id', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
   
        const { id } = req.params;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errores: errors.array()});
        }

        const directorActualizado = await Director.findByIdAndUpdate(id, req.body, {new: true})
        if(!directorActualizado){
            return res.status(400).send("Director no encotrado");
        }
        res.status(200).json(directorActualizado);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el director');
    }
});

//Eliminar director

 router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const directorEliminado = await Director.findByIdAndDelete(id);

        if (!directorEliminado){
            return res.status(404).send('director no encontrado');
        }

        res.send('director eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar al director');
    }
 })

module.exports = router;
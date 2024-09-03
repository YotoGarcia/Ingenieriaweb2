const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Genero = require('../models/Genero.js');


//Metodo llamar

router.get('/', async function(req, res){
    try{
        const genero = await Genero.find();
        res.status(200).json(genero);
    } catch(error){
        console.log('Error al obtener Genero', error);
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

        const nuevoGenero = new Genero({nombre, estado});
        const generoGuardado = await nuevoGenero.save()

        res.status(201).json(generoGuardado);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el Género')
    }
    
});

//Metodo actualizar

router.put('/:generoId', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
   
        if (!mongoose.Types.ObjectId.isValid(req.params.generoId)) {
            return res.status(400).send('ID de Género no válido');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let genero = await Genero.findById(req.params.generoId);
        if (!genero) {
            return res.status(404).send('Género no existe');
        }

        const { nombre, estado } = req.body;

        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }

        genero.nombre = nombre;
        genero.estado = estado;
        genero.fechaActualizacion = new Date();


        const generoActualizado = await genero.save();
        res.send(generoActualizado);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el Género');
    }
});

//Metodo Eliminar 

 router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const generoEliminado = await Genero.findByIdAndDelete(id);

        if (!generoEliminado){
            return res.status(404).send('Género no encontrado');
        }

        res.send('Género eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar al Genero');
    }
 })

module.exports = router;
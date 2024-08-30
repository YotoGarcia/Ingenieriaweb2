
const { Router } = require('express');
const {validationResult, check} = require('express-validator');
const Usuario = require('../models/Usuario');

const router = Router();

router.get('/', async function(req, res){
    try{
        const usuarios = await Usuario.find();
        res.send(usuarios)
    } catch(error){
        console.log(error);
        res.status(500).send('ocuarrio un error')
    }
});

router.post('/', [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('estado', 'Estado inválido').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try {
        console.log(req.body);

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mesanje: errors.array()})
        }

        const { nombre, email, estado } = req.body; 

        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }

        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            estado,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.send(usuarioGuardado);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el usuario')
    }
    
});

module.exports = router;

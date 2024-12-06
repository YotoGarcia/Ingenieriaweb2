const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {validarJWT} = require('../middleware/validar-jwt')
const {validarRolAdmin} = require('../middleware/validar-rol-admin')


//Metodo llamar

router.get('/',[validarJWT, validarRolAdmin ], async function(req, res){
    try{
        const usuarios = await Usuario.find();
        res.send(usuarios)
    } catch(error){
        console.log(error);
        res.status(500).send('ocurrio un error')
    }
});

//Metodo crear

router.post('/', [validarJWT, validarRolAdmin ], [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no valido').isEmail(),
    check('estado', 'Estado no valido').isIn(['Activo', 'Inactivo']),
    check('password', 'password no válido').not().isEmpty(),
    check('rol', 'rol no valido').isIn(['Administrador', 'Docente']),
], async function(req, res) {
    try {
        console.log(req.body);

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const { nombre, email, estado, password, rol } = req.body; 

        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }

        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }
        
        const salt = await bcrypt.genSaltSync(10);
        const passwordEncrip = await bcrypt.hash(password, salt);
            

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            estado,
            password: passwordEncrip,
            rol,
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

//Metodo actualizar

router.put('/:usuarioId',[validarJWT, validarRolAdmin ], [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no valido').isEmail(),
    check('estado', 'Estado no valido').isIn(['Activo', 'Inactivo']),
    check('password', 'password no válido').not().isEmpty(),
    check('rol', 'rol no valido').isIn(['Administrador', 'Docente']),
], async function(req, res) {
    try {
   
        if (!mongoose.Types.ObjectId.isValid(req.params.usuarioId)) {
            return res.status(400).send('ID de usuario no válido');
        }


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }


        let usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(404).send('Usuario no existe');
        }

        const { nombre, email, estado, password, rol } = req.body; 


        if (!nombre) {
            return res.status(400).send('El campo nombre es obligatorio');
        }


        const existeUsuario = await Usuario.findOne({ email, _id: { $ne: usuario._id } });
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }

        usuario.nombre = nombre;
        usuario.email = email;
        usuario.estado = estado;
        usuario.password = password;
        usuario.rol = rol;
        usuario.fechaActualizacion = new Date();


        const usuarioActualizado = await usuario.save();
        res.send(usuarioActualizado);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar el usuario');
    }
});

//Eliminar usuario

 router.delete('/:usuarioId', async function (req, res) {
    try{
        const usuarioId = req.params.usuarioId;

        if(!mongoose.Types.ObjectId.isValid(usuarioId)){
            return res.status(400).send("ID no valida");
        }

        const resultado = await Usuario.findByIdAndDelete(usuarioId);

        if (!resultado){
            return res.status(400).send('Usuario no encontrado');
        }

        res.send('Usuario eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocuarrio un error al eliminar al usuario');
    }
 })

module.exports = router;
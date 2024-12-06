const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {generarJwt} = require('../helper/jwt');


//Metodo loguear

router.post('/', [

    check('email', 'Email no valido').isEmail(),
    check('password', 'password no válido').not().isEmpty(),

], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return res.status(400).send('User not fount');
        }

        const passwordIguales = bcrypt.compareSync(req.body.password, usuario.password);
        if(!passwordIguales){
            return res.status(400).json({mensaje: "User not fount"});
        }

        const token = generarJwt(usuario);

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email, access_token: token
        })

            

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error')
    }
    
});

module.exports = router;
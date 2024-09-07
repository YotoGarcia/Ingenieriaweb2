const {Router} = require('express');
const Media = require ('../models/Media.js');
const {validationResult, check} = require('express-validator');

const router = Router();

//Metodo Obtener

router.get('/', async function(req, res){
    try{
        const media = await Media.find().populate([
            {
                path:'director', select: 'nombre estado'
            },
            {
                path:'genero', select: 'nombre estado'
            },
            {
                path: 'productora', select: 'nombre estado'
            },
            {
                path: 'tipo', select: 'nombre descripcion'
            }
        ]);
        res.status(200).json(media);
    } catch(error){
        console.log('Error al obtener Media', error);
        res.status(500).send('ocuarrio un error')
    }
});

//Metodo crear

router.post('/',[
    check('serial', 'Serial es requerido').not().isEmpty(),
    check('titulo', 'TItulo es requerido').not().isEmpty(),
    check('sinopsis', 'sinopsis es requerido').not().isEmpty(),
    check('url', 'Url es requerido').not().isEmpty(),
    check('imagen', 'Imagen es requerido').not().isEmpty(),
    check('genero', 'Genero es requerido').not().isEmpty(),
    check('director', 'Director es requerido').not().isEmpty(),
    check('productora', 'Productora es requerido').not().isEmpty(),
    check('tipo', 'Tipo es requerido').not().isEmpty(),


], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})
        }

        const existeMediaPorSerial = await Media.findOne({serial: req.body.serial});
        if(existeMediaPorSerial){
            return res.status(400).send("Ya existe este serial");
        }

        let media = new Media();
        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sinopsis = req.body.sinopsis;
        media.url = req.body.url;
        media.imagen = req.body.imagen;
        media.genero = req.body.genero._id;
        media.director = req.body.director._id;
        media.productora = req.body.productora._id;
        media.tipo = req.body.tipo._id;
        media.fechaCreacion = new Date();
        media.fechaActualizacion = new Date();

        
        media = await media.save();
        res.send(media);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al crear Media')
    }
    
});

//Metodo actualizar

router.put('/:mediaId',[
    check('serial', 'Nombre es requerido').not().isEmpty(),
    check('titulo', 'Titulo es requerido').not().isEmpty(),
    check('sinopsis', 'sinopsis es requerido').not().isEmpty(),
    check('url', 'Nombre es requerido').not().isEmpty(),
    check('imagen', 'Imagen es requerido').not().isEmpty(),
    check('genero', 'Genero es requerido').not().isEmpty(),
    check('director', 'Director es requerido').not().isEmpty(),
    check('productora', 'Productora es requerido').not().isEmpty(),
    check('tipo', 'Tipo es requerido').not().isEmpty(),


], async function(req, res) {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()})

        }

        let media =await Media.findById(req.params.mediaId);
        if(!media){
            return res.status(400).send('Media no existe')
        }

        const existeMediaPorSerial = await Media.findOne({serial: req.body.serial, id: { $ne: media._id}});
        if(existeMediaPorSerial){
            return res.status(400).send("Ya existe este serial");
        }

        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sinopsis = req.body.sinopsis;
        media.url = req.body.url;
        media.imagen = req.body.imagen;
        media.genero = req.body.genero._id;
        media.director = req.body.director._id;
        media.productora = req.body.productora._id;
        media.tipo = req.body.tipo._id;
        media.fechaActualizacion = new Date();

        
        media = await media.save();
        res.send(media);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error al actualizar Media')
    }
    
});

//Metodo Eliminar 

 router.delete('/:id', async function (req, res) {
    try{
        const {id} = req.params;

        const mediaEliminado = await Media.findByIdAndDelete(id);

        if (!mediaEliminado){
            return res.status(404).send('Media no encontrado');
        }

        res.send('Media eliminado exitosamente');
    } catch (error){
        res.sendStatus(500).send('Ocurrio un error al eliminar Media');
    }
 });

module.exports = router;
require('dotenv').config();

const express = require('express');
const multer = require('multer')
const router = express.Router();
const upload = multer();
//////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA O REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
const {logeo} = require('../funciones/login/reconocimiento');
const {usuario_autenticador} = require('../funciones/login/identificador')
const {usuario_tipo} = require('../funciones/login/registro')

router.use(express.json());

// router.get('/')
router.post('/',upload.none(),logeo);

router.get('/identificador',objevacio,usuario_autenticador)///deberia ser cuando si esta identificado
router.get('/identificador',(req,res)=>{
    res.status(400).json({
        "status":"ERROR",
        "codigo":2,
        "msg":"no logeado en otra ruta"
    })
})////deberia ser cuando no esta identificado

router.get('/registro',usuario_tipo)


module.exports=router
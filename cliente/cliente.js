require('dotenv').config();

const express = require('express');
const multer= require('multer')
const router = express.Router();
const upload = multer();

///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
// const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES
const {buscar} = require('../funciones/cliente/buscar')

router.use(express.json());

// router.get('/',objevacio,coti_permisos)

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/buscar',buscar)
// router.get('/id',)

module.exports=router
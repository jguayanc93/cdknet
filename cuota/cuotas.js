require('dotenv').config();

const express = require('express');
// const multer= require('multer')
const router = express.Router();
// const upload = multer();
///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
const {cuota_permisos} = require('../funciones/cuota/permisos')
const {cuota_revisar} = require('../funciones/cuota/revisar')
const {cuota_registrar} = require('../funciones/cuota/registrar')
const {cuota_direccionador} = require('../funciones/cuota/mostrar')
const {cuota_cobertura} = require('../funciones/cuota/cobertura')
const {cuota_cartera} = require('../funciones/cuota/cartera')
// const {} = require('../funciones/cuota/especialista')
// const {} = require('../funciones/cuota/jefatura')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,cuota_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})
////////////REVISA PORQE ESTE COTIZACION DA PROBLEMAS 009-00910388 CUANDO SE LE PIDE QUE TRAIGA SUS PROMOCIONES
/////estas rutas son para sus respectivos accesos segun pueda o no
router.get('/revisar',cuota_revisar)
router.post('/update',cuota_registrar)
router.get('/mostrar',cuota_direccionador)
/////mandalos a sus respectivas rutas
router.get('/cobertura',cuota_cobertura)
router.post('/cartera',cuota_cartera)
// router.post('/especialista')
// router.post('/jefatura')

module.exports=router
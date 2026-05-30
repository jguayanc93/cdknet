require('dotenv').config();

const express = require('express');
// const multer= require('multer')
const router = express.Router();
// const upload = multer();
///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
// const {vendedor_permisos} = require('../funciones/vendedor/redirigir_tipo')

const {pedi_permisos} = require('../funciones/pedido/permisos')
const {revisar} = require('../funciones/cotizacion/mostrar')
const {aplicar_flete} = require('../funciones/pedido/aplicar_flete')
// const {almacen_cambio} = require('../funciones/cotizacion/almacen')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,pedi_permisos)

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/mostrar',aplicar_flete)
// router.post('/flete',)

module.exports=router
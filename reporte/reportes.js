require('dotenv').config();

const express = require('express');
// const multer= require('multer')
const router = express.Router();
// const upload = multer();
///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
const {vendedor_permisos} = require('../funciones/vendedor/redirigir_tipo')
// const {grupos_modulos} = require('../funciones/vendedor/cobertura_modulos')
const {coti_permisos} = require('../funciones/cotizacion/permisos')
const {mostrador_marcas} = require('../funciones/reportes/marcas')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,coti_permisos)

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/marcas',mostrador_marcas)
// router.post('/stoc',revisar)
// router.post('/precios',ver_all)
// router.post('/tiempo',modificacion)

module.exports=router
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
const {factura_permisos} = require('../funciones/factura/permisos')
const {cotizacionxdia} = require('../funciones/lista/cotizacion')
const {pedidoxdia} = require('../funciones/lista/pedido')
const {facturaxdia} = require('../funciones/lista/factura')
const {cotizacionxdiaxelegido} = require('../funciones/lista/cotizacionxdia')
const {pedidoxdiaxelegido} = require('../funciones/lista/pedidosxdia')
const {facturaxdiaxelegido} = require('../funciones/lista/facturasxdia')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,factura_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/despacho',cotizacionxdia)
router.post('/transporte',pedidoxdia)
router.post('/atencion',facturaxdia)
router.post('/direccion',cotizacionxdiaxelegido)
router.post('/vendedor',pedidoxdiaxelegido)
router.post('/observacion',facturaxdiaxelegido)
router.post('/orden',facturaxdiaxelegido)
// router.post('/update',modificacion)


module.exports=router
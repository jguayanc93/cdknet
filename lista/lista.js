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
const {lista_permisos} = require('../funciones/lista/permisos')
const {cotizacionxdia} = require('../funciones/lista/cotizacion')
const {pedidoxdia} = require('../funciones/lista/pedido')
const {facturaxdia} = require('../funciones/lista/factura')
const {creacion} = require('../funciones/cotizacion/crear')
const {modificacion} = require('../funciones/cotizacion/modificar')
const {revisar} = require('../funciones/cotizacion/mostrar')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,lista_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/cotis',cotizacionxdia)
router.post('/pedidos',pedidoxdia)
router.post('/facturas',facturaxdia)
// router.post('/read',revisar)
// router.post('/update',modificacion)


module.exports=router
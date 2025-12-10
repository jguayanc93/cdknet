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
const {facturaxdespacho} = require('../funciones/factura/despacho')
const {facturaxtransportista} = require('../funciones/factura/transportista')
const {facturaxatencion} = require('../funciones/factura/atencion')
const {facturaxdireccion} = require('../funciones/factura/direccion')
const {facturaxvendedor} = require('../funciones/factura/vendedor')
const {facturaxobservacion} = require('../funciones/factura/observacion')
const {facturaxorden} = require('../funciones/factura/orden')

const {facturaxdespachoxsugerencia} = require('../funciones/factura/cambio_despacho')
const {facturaxtransportistaxsugerencia} = require('../funciones/factura/cambio_transportista')
const {facturaxatencionxsugerencia} = require('../funciones/factura/cambio_atencion')
const {facturaxdireccionxsugerencia} = require('../funciones/factura/cambio_direccion')
const {facturaxvendedorxsugerencia} = require('../funciones/factura/cambio_vendedor')
// const {} = require('../funciones/factura/cambio_observacion')
// const {} = require('../funciones/factura/cambio_orden')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,factura_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})

/////estas rutas son para sus respectivos accesos segun pueda o no
// router.post('/campo',facturaxcampo)
router.post('/despacho',facturaxdespacho)
router.post('/transporte',facturaxtransportista)
router.post('/atencion',facturaxatencion)
router.post('/direccion',facturaxdireccion)
router.post('/vendedor',facturaxvendedor)
router.post('/observacion',facturaxobservacion)
router.post('/orden',facturaxorden)
// router.post('/update',modificacion)
router.post('/despacho/cambio',facturaxdespachoxsugerencia)
router.post('/transporte/cambio',facturaxtransportistaxsugerencia)
router.post('/atencion/cambio',facturaxatencionxsugerencia)
router.post('/direccion/cambio',facturaxdireccionxsugerencia)
router.post('/vendedor/cambio',facturaxvendedorxsugerencia)


module.exports=router
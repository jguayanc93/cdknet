require('dotenv').config();

const express = require('express');
// const multer= require('multer')
const router = express.Router();
// const upload = multer();
///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
// const {vendedor_permisos} = require('../funciones/vendedor/redirigir_tipo')
// const {grupos_modulos} = require('../funciones/vendedor/cobertura_modulos')
const {promo_permisos} = require('../funciones/promocion/permisos')

const {prom_buscar} = require('../funciones/promocion/buscar')
const {prom_analisar} = require('../funciones/promocion/mostrar')
const {prom_adjuntar} = require('../funciones/promocion/analisar')
const {prom_acoplar} = require('../funciones/promocion/adjuntar')
const {prom_remover} = require('../funciones/promocion/remover')
//////////////
const {prom_buscar_paso1} = require('../funciones/promocion/simple_buscador_paso1')
const {prom_temporal_mejorada} = require('../funciones/promocion/simulacion_prom')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,promo_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/recolector',prom_buscar_paso1)
router.post('/detalle',prom_temporal_mejorada)
// router.post('/delete',)
router.post('/revisar',prom_buscar)
router.post('/mostrar',prom_analisar,prom_adjuntar)
router.post('/acoplar',prom_acoplar)
router.post('/eliminar',prom_remover)

module.exports=router
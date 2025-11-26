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
const {coti_permisos} = require('../funciones/cotizacion/permisos')
// const {revisar} = require('../funciones/cotizacion/mostrar')
// const {ver_all} = require('../funciones/cotizacion/mostrar_todo')
const {prom_buscar} = require('../funciones/promocion/buscar')
const {prom_analisar} = require('../funciones/promocion/mostrar')
const {prom_adjuntar} = require('../funciones/promocion/analisar')

router.use(express.json());

//////TENDRAS QUE LANSAR RUTAS ALTERNAS PARA CADA TIPO DE VENDEDOR
router.get('/',objevacio,coti_permisos)
// router.get('/',(req,res)=>{res.status(200).send("deberia enviarte al login de nuevo por no tener galletas")})

/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/revisar',prom_buscar)
router.post('/mostrar',prom_analisar,prom_adjuntar)
// router.post('/eliminar',)

module.exports=router
require('dotenv').config();

const express = require('express');
const multer= require('multer')
const router = express.Router();
const upload = multer();

///////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA 0 REQUIERA
// const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES
const {buscar} = require('../funciones/producto/buscar')
const {identificado} = require('../funciones/producto/identificado')
const {rentabilidad} = require('../funciones/producto/rentabilidad')
const {encontrado} = require('../funciones/producto/encontrado')

const {buscar_marcas} = require('../funciones/producto/marcas')

router.use(express.json());


/////estas rutas son para sus respectivos accesos segun pueda o no
router.post('/buscar',buscar)
router.post('/id',identificado)
///esta ruta debe ser corregida despues porqe es duplicidad en la busqueda de productos cuando modifica cotizacion
router.post('/encontrado',encontrado)
router.post('/rentabilidad',rentabilidad)
////estas rutas de abajo son para otros casos particulares que se pueden aplicar a buscar marcas y grupos de prod
router.post('/marcas',buscar_marcas)

module.exports=router
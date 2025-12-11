require('dotenv').config();

const express = require('express');
const multer = require('multer')
const router = express.Router();
const upload = multer();
//////ESPACIO PARA FUNCIONES GENERALES SI TUVIERA O REQUIERA
const {objevacio} = require('../funciones/objvacio')
//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
const {deslogeo} = require('../funciones/logout/cerrar_sesion')
// const {logeo} = require('../funciones/login/reconocimiento');
const {usuario_autenticador} = require('../funciones/login/identificador')
const {usuario_tipo} = require('../funciones/login/registro')
const {usuario_registrado} = require('../funciones/login/registro_completo')

router.use(express.json());

router.post('/',deslogeo);

// router.get('/identificador',objevacio,usuario_autenticador)///deberia ser cuando si esta identificado

// router.get('/registro',usuario_tipo)
// router.post('/registro/completado',upload.none(),usuario_registrado)


module.exports=router
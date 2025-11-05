require('dotenv').config();

const express = require('express');
const multer = require('multer')
const router = express.Router();
const upload = multer();

//////ESPACIO PARA FUNCIONES DE COMPROBACION PARA LOS QUERYS
const {logeo} = require('../funciones/login/reconocimiento');
const {usuario_autenticador} = require('../funciones/login/identificador')

router.use(express.json());

// router.get('/')
router.post('/',upload.none(),logeo);

router.get('/identificador',usuario_autenticador)


module.exports=router
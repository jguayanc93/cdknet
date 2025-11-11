require('dotenv').config();
const jws = require('jws');
// const cookieParser = require('cookie-parser')
// const {Request,TYPES} = require('../../conexion/cadena')
// const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {identificador_logeo} = require('../../querys/login/identificador');
///////ESPACIO PARA FUNCIONES GENERALES
let modulos = require('../modulos')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function grupos_modulos(req,res,next) {
    try{
        ////para dar ciertos permisos y caracteristicas especiales y poder dividirlos
        const primera_call= await consulta1(req,next);
        const segunda_call= await consulta2(primera_call,req,next);
        // const segunda_call= await obtenerpromesa_conexion();

        res.status(200).json(JSON.stringify(segunda_call));
    }
    catch(err){
        error_corrector(res,err);
    }
}

// function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

function consulta2(payload,req,next){
    return new Promise((resolve,reject)=>manejo_grupo(resolve,reject,payload,req,next))
}

function manejo_grupo(resolve,reject,payload,req,next){
    let grp=payload.id_grupo;
    let permisos=modulos[`grupo${grp}`];
    resolve(permisos);
}

function galleta_credencial(resolve,reject,req,next){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}
    
}

module.exports={grupos_modulos}
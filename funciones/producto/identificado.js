require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {producto_id} = require('../../querys/producto/identificar');
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function identificado(req,res,next) {
    try{
        const primera_call= await consulta1(req,next);
        const segundo_call= await obtenerpromesa_conexion();
        const tercer_call= await consulta2(segundo_call,req,next);

        res.status(200).json(JSON.stringify(tercer_call));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

function consulta2(conexion,req,next){
    return new Promise((resolve,reject)=>producto_id(resolve,reject,conexion,req,next))
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

module.exports={identificado}
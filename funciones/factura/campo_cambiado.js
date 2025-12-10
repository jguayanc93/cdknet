require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
const {consultas_almacenadas} = require('./identificador');
let {factura_campo_update} = require('../../querys/factura/campo_modificado')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function facturaxcampoxcambiado(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const segunda_call = await consulta2(req.body);//[consulta,remplazo,doc]
        const tercera_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercera_call,segunda_call);
        
        res.status(200).json(cuarta_call);
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(body){ return new Promise((resolve,reject)=>campo_identificado(resolve,reject,body)) }

function consulta3(conexion,utilidades){ return new Promise((resolve,reject)=>factura_campo_update(resolve,reject,conexion,utilidades)) }

function galleta_credencial(resolve,reject,req,next){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}    
}

function campo_identificado(resolve,reject,obje){

    let encontrado=Object.keys(consultas_almacenadas).findIndex((match)=>match==Object.keys(obje)[0])
    
    let remplazo=obje[Object.keys(obje)[0]];

    if(encontrado!=-1){
        resolve([consultas_almacenadas[Object.keys(obje)[0]],remplazo,obje.doc]);
    }
    else{
        reject("no match");
    }
}



module.exports={facturaxcampoxcambiado}
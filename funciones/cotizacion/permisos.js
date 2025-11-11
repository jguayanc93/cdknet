require('dotenv').config();
const jws = require('jws');

// const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {identificador_logeo} = require('../../querys/login/identificador');
///////ESPACIO PARA FUNCIONES GENERALES
let permisos = require('../permisos')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function coti_permisos(req,res,next) {
    try{
        const primera_call= await consulta1(req,next);
        const segunda_call= await consulta2(req,next);
        /////aquie es donde tengo q asignar los permisos segun corresponda
        const tercer_call= await consulta3(primera_call,segunda_call,req,next);
        // const cuarto_call= await obtenerpromesa_conexion();

        res.status(200).json(JSON.stringify({"accesos":tercer_call}));
        // res.redirect(tercer_call);
    }
    catch(err){
        error_corrector(res,err);
    }
}

// function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

function consulta2(req,next){
    return new Promise((resolve,reject)=>galleta_tipo(resolve,reject,req,next))
}

function consulta3(payload,tipo,req,next){
    return new Promise((resolve,reject)=>ver_permisos(resolve,reject,payload,tipo,req,next))
}

function ver_permisos(resolve,reject,payload,tipo,req,next){
    
    const diferenciador=tipo.toLowerCase();///nose se usara por mientras
    const grupo=payload.id_grupo;
    let accesos_garantizados=[];

    for(const access of Object.keys(permisos["cotizacion"])){
        if(permisos["cotizacion"][access].includes(parseInt(grupo))){
            accesos_garantizados.push(access);
        }
    }

    resolve(accesos_garantizados);
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

function galleta_tipo(resolve,reject,req,next){
    /////esta galleta solo esta firmada no esta en un jws
    let tipo=req.signedCookies.tip;
    if(typeof tipo ==='string'){
        resolve(tipo)
    }
    else{reject("falsa galleta")}
}

module.exports={coti_permisos}
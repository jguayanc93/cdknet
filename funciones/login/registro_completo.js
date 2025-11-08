require('dotenv').config();
const jws = require('jws');
// const cookieParser = require('cookie-parser')
// const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {logeo_registro} = require('../../querys/login/registro');
//////espacio para la implementacion del token
// let {jwtgenerator} = require('../../login/token')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function usuario_registrado(req,res,next) {
    try{
        ////lo que necesito estan en las cookies firmadas pero solo pueden usarse en produccion no en desarrollo        
        const primera_call= await consulta1(req,next);
        const segunda_call= await obtenerpromesa_conexion();
        const tercera_call= await consulta2(primera_call,segunda_call,req);

        res.cookie('tip',tercera_call,{
            domain:'compudiskett.com.pe',
            path:'/',
            httpOnly:true,
            maxAge:1000 * 60 * 60,
            sameSite:'None',
            secure:true,
            signed:true
        })
        res.redirect('/v1/login/identificador');

        // res.status(200).json(JSON.stringify({"grupo":primera_call.nom_grupo}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

function consulta2(payload,conexion,req){
    return new Promise((resolve,reject)=>logeo_registro(resolve,reject,payload,conexion,req))
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

module.exports={usuario_registrado}
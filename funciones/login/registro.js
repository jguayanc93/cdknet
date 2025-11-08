require('dotenv').config();
const jws = require('jws');
// const cookieParser = require('cookie-parser')
// const {Request,TYPES} = require('../../conexion/cadena')
// const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {identificador_logeo} = require('../../querys/login/identificador');
//////espacio para la implementacion del token
// let {jwtgenerator} = require('../../login/token')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function usuario_tipo(req,res,next) {
    try{
        ////lo que necesito estan en las cookies firmadas pero solo pueden usarse en produccion no en desarrollo        
        const primera_call= await consulta1(req,next);
        // const segunda_call= await obtenerpromesa_conexion();
        // const tercera_call= await consulta2(primera_call,segunda_call);

        res.status(200).json(JSON.stringify({"grupo":primera_call.nom_grupo}));
    }
    catch(err){        
        error_corrector(res,err);
    }
}

// function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

// function consulta2(payload,conexion){
//     return new Promise((resolve,reject)=>identificador_logeo(resolve,reject,payload,conexion))
// }

function galleta_credencial(resolve,reject,req,next){
    // console.log(req.signedCookies.cdk);
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}
    
}

module.exports={usuario_tipo}
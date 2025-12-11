require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {comprobacion_logeo} = require('../../querys/login/reconocimiento');
//////espacio para la implementacion del token
let {jwtgenerator} = require('../../login/token')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function deslogeo(req,res,next) {
    try{
        // const primera_call= await obtenerpromesa_conexion();
        // const segunda_call= await consulta1(primera_call,req,next);
        // const tercera_call= await consulta2(segunda_call);

        res.clearCookie('cdk',{
            domain:'compudiskett.com.pe',
            path:'/',
            sameSite:'None',
            secure:true
        })
        res.clearCookie('tip',{
            domain:'compudiskett.com.pe',
            path:'/',
            sameSite:'None',
            secure:true
        })
        res.status(200).json({"galletas":"borradas"})
        
    }
    catch(err){        
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,req,next){
    return new Promise((resolve,reject)=>comprobacion_logeo(resolve,reject,conexion,req,next))
}
/////supongo que hara otra cosa en lugar de ejecutar query
// function consulta2(usuario){
//     return new Promise((resolve,reject)=>identificacion_logeo(resolve,reject,usuario))
// }


module.exports={deslogeo}
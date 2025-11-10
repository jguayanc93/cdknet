require('dotenv').config();
const jws = require('jws');
// const cookieParser = require('cookie-parser')
// const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {identificador_logeo} = require('../../querys/login/identificador');
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function vendedor_permisos(req,res,next) {
    try{
        ////lo que necesito estan en las cookies firmadas pero solo pueden usarse en produccion no en desarrollo
        ////dividir las consultas para conocer al vendedor y su area y sus diferencias para crear otra galleta
        ////para dar ciertos permisos y caracteristicas especiales y poder dividirlos
        const primera_call= await consulta1(req,next);
        const segunda_call= await consulta2(req,next);
        const tercer_call= await consulta3(primera_call,segunda_call,req,next);
        // const segunda_call= await obtenerpromesa_conexion();

        res.status(200).json(JSON.stringify({"tipo":tercer_call}));
        // res.redirect('/v1/vendedor/');
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
    return new Promise((resolve,reject)=>mandar_a_su_ruta(resolve,reject,payload,tipo,req,next))
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

function mandar_a_su_ruta(resolve,reject,payload,tipo,req,next){
    const diferenciador=tipo.toLowerCase();
    resolve(diferenciador);

}

module.exports={vendedor_permisos}
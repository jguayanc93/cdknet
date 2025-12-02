require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {cuota_existe} = require('../../querys/cuota/revisar_registro')
let {registro_cuota} = require('../../querys/cuota/registrar')
let {cuota_tiempo} = require('../../querys/cuota/mostrar')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_direccionador(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await consulta2(req);
        const tercera_call = await consulta4(primera_call,segunda_call);
        
        res.redirect(`/v1/cuota/${tercera_call}`)
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req)) }

function consulta2(req){ return new Promise((resolve,reject)=>galleta_tipo(resolve,reject,req)) }

function consulta3(conexion,galleta,diferenciador){ return new Promise((resolve,reject)=>cuota_tiempo(resolve,reject,conexion,galleta,diferenciador)) }

function consulta4(galleta,diferenciador){ return new Promise((resolve,reject)=>tipo_direccionador(resolve,reject,galleta,diferenciador)) }


function galleta_credencial(resolve,reject,req){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}
}

function galleta_tipo(resolve,reject,req){
    /////esta galleta solo esta firmada no esta en un jws
    let tipo=req.signedCookies.tip;
    if(typeof tipo ==='string'){
        resolve(tipo)
    }
    else{reject("falsa galleta")}
}

function tipo_direccionador(resolve,reject,galleta,diferenciador){
    ////aqui es donde le decimos en texto un mensaje referente al avance
    switch (diferenciador) {
        case "COBERTURA":
            resolve(diferenciador.toLowerCase());
            break;

        case "CARTERA":
            resolve(diferenciador.toLowerCase());
            break;

        case "ESPECIALISTA":
            resolve(diferenciador.toLowerCase());
            break;

        case "JEFATURA":
            resolve(diferenciador.toLowerCase());
            break;

        case "ZONA":
            resolve(diferenciador.toLowerCase());
            break;
    
        default:
            resolve("error inesperado")
            break;
    }
}



module.exports={cuota_direccionador}
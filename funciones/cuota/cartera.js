require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {cuota_existe} = require('../../querys/cuota/revisar_registro')
let {registro_cuota} = require('../../querys/cuota/registrar')
let {cuota_tiempo} = require('../../querys/cuota/mostrar')
let {promo_vertodo} = require('../../querys/promocion/cotizacion')
let {promo_buscador} = require('../../querys/promocion/buscador')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_cartera(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await consulta2(req);
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call,primera_call,segunda_call);
        const quinta_call = await consulta4(cuarta_call);
        const sexta_call = await obtenerpromesa_conexion();
        const setima_call = await consulta5(sexta_call,primera_call,segunda_call);
        
        res.status(200).json();
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req)) }

function consulta2(req){ return new Promise((resolve,reject)=>galleta_tipo(resolve,reject,req)) }

function consulta3(conexion,galleta,diferenciador){ return new Promise((resolve,reject)=>cuota_tiempo(resolve,reject,conexion,galleta,diferenciador)) }

function consulta4(tiempo){ return new Promise((resolve,reject)=>avance_mensaje(resolve,reject,tiempo)) }

function consulta5(conexion,){ return new Promise((resolve,reject)=>avance_mensaje(resolve,reject,tiempo)) }


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

function avance_mensaje(resolve,reject,tiempo){
    ////aqui es donde le decimos en texto un mensaje referente al avance
    switch (tiempo[7]) {
        case tiempo[7]>=30:
            resolve("tienes tiempo de sobra");
            break;

        case tiempo[7]>=20:
            resolve("aun tienes mas de la mitad de mes");
            break;

        case tiempo[7]>=10:
            resolve("anda ajustando que ya no tienes ni la mitad de mes");
            break;

        case tiempo[7]>=5:
            resolve("ya estas en los ultimos dias");
            break;

        case tiempo[7]>=2:
            resolve("tik tok señor wick");
            break;
    
        default:
            resolve("error inesperado")
            break;
    }
}



module.exports={cuota_cartera}
require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {cuota_existe} = require('../../querys/cuota/revisar_registro')
let {registro_cuota} = require('../../querys/cuota/registrar')
let {cuota_tiempo} = require('../../querys/cuota/mostrar')
let {cuota_avance_cobertura} = require('../../querys/cuota/cobertura')
// let {promo_vertodo} = require('../../querys/promocion/cotizacion')
// let {promo_buscador} = require('../../querys/promocion/buscador')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_cobertura(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await consulta2(req);//diferenciador
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call,primera_call,segunda_call);///tiempos
        const quinta_call = await consulta4(cuarta_call);//mensaje temporal segun dias restantes
        const sexta_call = await obtenerpromesa_conexion();
        const setima_call = await consulta5(sexta_call,primera_call,segunda_call);//monto recaudado hasta el momento
        const octava_call = await consulta6(cuarta_call,setima_call,quinta_call);
        
        res.status(200).json(octava_call);
        // res.status(200).json({"revisa":[octava_call,cuarta_call]});
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

function consulta5(conexion,galleta,diferenciador){ return new Promise((resolve,reject)=>cuota_avance_cobertura(resolve,reject,conexion,galleta,diferenciador)) }

function consulta6(tiempos,monto,textodia){ return new Promise((resolve,reject)=>estimacion_monto(resolve,reject,tiempos,monto,textodia)) }


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
    switch (true) {
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

        case tiempo[7]==1:
            resolve("ahora ps llego el dia");
            break;
    
        default:
            resolve("error inesperado")
            break;
    }
}

function estimacion_monto(resolve,reject,tiempos,monto,textodia){
    let objformato={}
    let mensaje="";

    let cuota_fijada=tiempos[3];
    let cuota_avanse=monto;

    let porcentaje= (cuota_avanse/cuota_fijada)*100;

    let recortado = `${porcentaje.toFixed(2)} %`;

    switch (true) {
        case porcentaje<=5:
            mensaje="que asi se chambea?";
            break;

        case porcentaje<=10:
            mensaje="comensando a calentar";
            break;

        case porcentaje<=20:
            mensaje="ya terminaste de vender a los clientes seguros del mes";
            break;

        case porcentaje<=30:
            mensaje="ya tienes un tercio";
            break;

        case porcentaje<=40:
            mensaje="ponte la camiseta tio";
            break;

        case porcentaje<=50:
            mensaje="WEEEEENA mitad desbloqueado";
            break;

        case porcentaje<=60:
            mensaje="no esperes que te pasen pedidos, buscalos";
            break;

        case porcentaje<=70:
            mensaje="buen monto pero no para comisionar";
            break;

        case porcentaje<=80:
            mensaje="un poco mas de esfuerso y llegamos al minimo para comisionar";
            break;

        case porcentaje<=90:
            mensaje="apurate goku, ya casi llegas a tu destino";
            break;

        case porcentaje<=100:
            mensaje="la PIZZA ya esta en camino apurate";
            break;

        case porcentaje>100:
            mensaje="TU SI ERES VENDEDOR NO COMO EL DE TU COSTADO";
            break;
    
        default:
            mensaje="error de mensajeria";
            break;
    }
    //////////////////
    objformato["diastexto"]=textodia;
    objformato["meta"]=tiempos[3];
    objformato["avance"]=monto;
    objformato["porcentaje"]=recortado;
    objformato["mensaje"]=mensaje;

    resolve(objformato);
}



module.exports={cuota_cobertura}
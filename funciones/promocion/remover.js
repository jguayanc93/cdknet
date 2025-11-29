require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys

// let {coti_montos} = require('../../querys/promocion/coti_montos')
// let {coti_update_montos} = require('../../querys/promocion/coti_update_montos')
// let {detallado_bucle} = require('../../querys/promocion/coti_detallado_update')
let {removido_items_bucle} = require('../../querys/promocion/prom_removedor')
let {removeflete} = require('../../querys/promocion/prom_flete_kitar')
let {coti_update_montos_promo_removidos} = require('../../querys/promocion/prom_actualisar_coti')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function prom_remover(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        // const segunda_call = await consulta2(req.body);
        const tercera_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercera_call,req.body);///eliminar las promociones
        const quinta_call = await consulta4(req.body)///extraer el numero de documento
        const sexta_call = await obtenerpromesa_conexion();
        const setima_call = await consulta5(sexta_call,quinta_call);//eliminar flete si tuviera
        const octava_call = await obtenerpromesa_conexion();
        const novena_call = await consulta6(octava_call,quinta_call);///corregir los montos de la cabecera
        
        res.status(200).send("removido con exito");
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

// function consulta2(cuerpo){ return new Promise((resolve,reject)=>direccionador(resolve,reject,cuerpo))}

function consulta3(conexion,body){ return new Promise((resolve,reject)=>removido_items_bucle(resolve,reject,conexion,body)) }

function consulta4(body){ return new Promise((resolve,reject)=>documento_numero(resolve,reject,body)) }

function consulta5(conexion,documento){ return new Promise((resolve,reject)=>removeflete(resolve,reject,conexion,documento)) }

function consulta6(conexion,documento){ return new Promise((resolve,reject)=>coti_update_montos_promo_removidos(resolve,reject,conexion,documento)) }

function documento_numero(resolve,reject,body){    

    let documento = body.removeproms[0][0];
    resolve(documento)
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



module.exports={prom_remover}
require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {tipo_cambio} = require('../../querys/cotizacion/tipcambio');
// let {num_correlativo} = require('../../querys/cotizacion/correlativo')
// let {correlativo_update} = require('../../querys/cotizacion/correlativo_update')
// let {coti_atencion} = require('../../querys/cotizacion/atencion')
// let {coti_cabecera} = require('../../querys/cotizacion/crear_cabecera')
// let {coti_detallado} = require('../../querys/cotizacion/crear_detallado')
let {limpiar_detallado} = require('../../querys/cotizacion/limpiar_detallado')
let {cabecera_corregido} = require('../../querys/cotizacion/corregir_cabecera')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function modificacion(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const segundo_call = await consulta2(req.body);
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call,segundo_call[0]);
        const quinta_call = await obtenerpromesa_conexion();
        const sexta_call = await consulta4(quinta_call,segundo_call);///aqui falta pasar parametros
        

        // res.status(200).json(JSON.stringify(tercer_call));
        res.status(200).json(JSON.stringify({"catorceava":catorceava_call}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(dataenviada){ return new Promise((resolve,reject)=>calcular(resolve,reject,dataenviada)) }

function consulta3(conexion){ return new Promise((resolve,reject)=>limpiar_detallado(resolve,reject,conexion)) }

function consulta4(conexion){ return new Promise((resolve,reject)=>cabecera_corregido(resolve,reject,conexion)) }

function consulta5(conexion,correlativo){ return new Promise((resolve,reject)=>correlativo_update(resolve,reject,conexion,correlativo)) }

function galleta_credencial(resolve,reject,req,next){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}    
}

function calcular(resolve,reject,dataenviada){
    let documento='';
    let totalisado=0;
    let ordenador=1;
    for(let itm in dataenviada){
        dataenviada[itm][8]=ordenador;
        totalisado+=parseFloat(dataenviada[itm][16]);
        if(documento==='') documento=dataenviada[itm][2];
        ordenador++;
    }
    let totalsoloigv=parseFloat((totalisado*0.18).toFixed(2));
    let totalconigv=parseFloat((totalisado*1.18).toFixed(2));
    
    resolve([documento,totalisado,totalsoloigv,totalconigv])
}

module.exports={modificacion}
require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {limpiar_detallado} = require('../../querys/cotizacion/limpiar_detallado')
let {cabecera_corregido} = require('../../querys/cotizacion/corregir_cabecera')
let {detallado_corregido} = require('../../querys/cotizacion/corregir_detallado')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function modificacion(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const segundo_call = await consulta2(req.body);//(documento,totalisado,igv,totalisadoconigv)
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call,segundo_call[0]);//limpiar el detallado
        const quinta_call = await obtenerpromesa_conexion();
        const sexta_call = await consulta4(quinta_call,segundo_call);///actualisar la cabecera
        const setima_call = await obtenerpromesa_conexion();
        const octava_call = await consulta5(setima_call,req.body);
        

        res.status(200).send(octava_call);
        // res.status(200).json(JSON.stringify({"catorceava":catorceava_call}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(dataenviada){ return new Promise((resolve,reject)=>calcular(resolve,reject,dataenviada)) }

function consulta3(conexion){ return new Promise((resolve,reject)=>limpiar_detallado(resolve,reject,conexion)) }

function consulta4(conexion,montos){ return new Promise((resolve,reject)=>cabecera_corregido(resolve,reject,conexion,montos)) }

function consulta5(conexion,dataenviada){ return new Promise((resolve,reject)=>detallado_corregido(resolve,reject,conexion,dataenviada)) }

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
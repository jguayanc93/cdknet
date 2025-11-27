require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {promocion_id} = require('../../querys/promocion/promocion_id')
// let {coti_contiene_promocion} = require('../../querys/promocion/promocion_en_cotizacion')
let {coti_montos} = require('../../querys/promocion/coti_montos')
let {coti_update_montos} = require('../../querys/promocion/coti_update_montos')
let {detallado_bucle} = require('../../querys/promocion/coti_detallado_update')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function prom_acoplar(req,res,next) {
    try{
        let fullpromo=req.body.fullpromo;
        // const primera_call = await consulta1(req,next);//galletas
        const segunda_call = await consulta2(req.body);
        if(segunda_call==='descuento'){
            const tercera_call = await obtenerpromesa_conexion();
            const cuarta_call = await consulta3(tercera_call,req.body.fullpromo);
            const quinta_call = await obtenerpromesa_conexion();
            const sexta_call = await consulta4(quinta_call,cuarta_call);
            delete fullpromo["descuento"];
        }
        console.log("esto es lo que estas kitando y quedando",fullpromo)
        const setima_call = await obtenerpromesa_conexion();
        const octava_call = await consulta5(setima_call,fullpromo);
        
        res.status(200).send(octava_call);
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(cuerpo){ return new Promise((resolve,reject)=>direccionador(resolve,reject,cuerpo))}

function consulta3(conexion,fullpromo){ return new Promise((resolve,reject)=>coti_montos(resolve,reject,conexion,fullpromo)) }

function consulta4(conexion,fullpromo){ return new Promise((resolve,reject)=>coti_update_montos(resolve,reject,conexion,fullpromo)) }

function consulta5(conexion,fullpromo){ return new Promise((resolve,reject)=>detallado_bucle(resolve,reject,conexion,fullpromo)) }

function direccionador(resolve,reject,cuerpo){
    let resultado;
    if(Object.keys(cuerpo.fullpromo).includes("descuento")){
        resultado="descuento";
    }
    else{ resultado="bonificacion";}
    console.log("este es el cuerpo a ser modificado",cuerpo.fullpromo);
    resolve(resultado)
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



module.exports={prom_acoplar}
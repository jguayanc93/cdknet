require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {cuota_marca_existe} = require('../../querys/cuota/revisar_registro_marca')
let {promo_vertodo} = require('../../querys/promocion/cotizacion')
let {promo_buscador} = require('../../querys/promocion/buscador')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_especialista(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await obtenerpromesa_conexion();
        const tercera_call = await consulta2(segunda_call,primera_call);
        const cuarta_call = await consulta3(tercera_call);
        
        res.status(200).json({"multiple":cuarta_call});
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req)) }

function consulta2(conexion,galleta){ return new Promise((resolve,reject)=>cuota_marca_existe(resolve,reject,conexion,galleta)) }

function consulta3(vendedor){ return new Promise((resolve,reject)=>manejador_marcas(resolve,reject,vendedor)) }

function manejador_marcas(resolve,reject,vendedor){

    let ordenado={}
    ordenado["nombre"]=vendedor[0];
    ordenado["tipo"]=vendedor[1];
    let marcas={}

    let parseado=JSON.parse(vendedor[2]);

    for(const marc in parseado){
        marcas[parseado[marc][0]]=[parseado[marc][1],parseado[marc][2]];
    }

    ordenado["marcas"]=marcas;

    resolve(ordenado);
}

function galleta_credencial(resolve,reject,req){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}    
}



module.exports={cuota_especialista}
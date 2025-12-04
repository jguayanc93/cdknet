require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {cuota_marca_existe} = require('../../querys/cuota/revisar_registro_marca')
let {revision_rapida_marca_existe2} = require('../../querys/cuota/revision_rapida_marca2')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_marca_revisor_rapido2(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await obtenerpromesa_conexion();
        const tercera_call = await consulta2(segunda_call,primera_call,req.body);
        // const cuarta_call = await consulta3(tercera_call);
        
        
        res.status(200).json({"procede":tercera_call});
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req)) }

function consulta2(conexion,galleta,body){ return new Promise((resolve,reject)=>revision_rapida_marca_existe2(resolve,reject,conexion,galleta,body)) }

// function consulta3(vendedor){ return new Promise((resolve,reject)=>manejador_marcas(resolve,reject,vendedor)) }


function galleta_credencial(resolve,reject,req){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}    
}



module.exports={cuota_marca_revisor_rapido2}
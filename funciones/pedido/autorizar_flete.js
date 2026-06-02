require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {activar_flete} = require('../../querys/pedido/autorizar_flete')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function autorizar_flete(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const segunda_call = await obtenerpromesa_conexion();
        const tercera_call = await consulta2(segunda_call,primera_call,req.body);
        ///faltan mas consultas para poder aplicarle el flete pero hasta aqui es suficiente para mostrar el pedido y revisar que se pueda aplicar el flete
        
        // res.status(200).json(JSON.stringify(tercer_call));
        res.status(200).json(JSON.stringify({"mensaje":tercera_call}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(conexion,data,cuerpo){ return new Promise((resolve,reject)=>activar_flete(resolve,reject,conexion,data,cuerpo)) }

function galleta_credencial(resolve,reject,req,next){
    let user_id=req.signedCookies.cdk;
    let valido=jws.verify(user_id,'HS256','chistemas')
    if(valido){
        let decodeado=jws.decode(user_id)
        resolve(decodeado.payload)
    }
    else{reject("falsa galleta")}    
}



module.exports={autorizar_flete}
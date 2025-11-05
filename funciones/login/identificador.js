require('dotenv').config();
// const cookieParser = require('cookie-parser')
// const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {comprobacion_logeo} = require('../../querys/login/reconocimiento');
//////espacio para la implementacion del token
// let {jwtgenerator} = require('../../login/token')

async function usuario_autenticador(req,res,next) {
    try{
        ////lo que necesito estan en las cookies firmadas pero solo pueden usarse en produccion no en desarrollo
        ////dividir las consultas para conocer al vendedor y su area y sus diferencias para crear otra galleta
        ////para dar ciertos permisos y caracteristicas especiales y poder dividirlos
        const primera_call= await consulta1(req,next);
        // const primera_call= await obtenerpromesa_conexion();
        // const tercera_call= await consulta2(segunda_call);

        res.status(200).json(JSON.stringify({"hola":"adios"}));
    }
    catch(err){        
        console.log(err);
        /////el error debes manejarlo con una funcion especial para diferenciar las trabas
        res.status(400).json({
            "status":"ERROR",
            "codigo":2,
            "msg":err
        })
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next))
}

function galleta_credencial(resolve,reject,req,next){
    console.log("exponer la galleta firmada");
    console.log(req.signedCookies);
    resolve("funciono?")
}

module.exports={usuario_autenticador}
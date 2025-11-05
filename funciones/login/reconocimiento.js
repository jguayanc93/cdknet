require('dotenv').config();

const {Request,TYPES} = require('../../conexion/cadena')
const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {comprobacion_logeo} = require('../../querys/login/reconocimiento');
//////espacio para la implementacion del token
let {jwtgenerator} = require('../../login/token')

async function logeo(req,res,next) {
    try{
        const primera_call= await obtenerpromesa_conexion();
        const segunda_call= await consulta1(primera_call,req,next);
        const tercera_call= await consulta2(segunda_call);

        res.cookie('cdk',tercera_call,{
            domain:'compudiskett.com.pe',
            path:'/',
            httpOnly:true,
            maxAge:1000 * 60 * 60 * 24,
            sameSite:'None',
            secure:true,
            signed:true
        })
        // res.redirect('/v1/login/identificador');
        // res.redirect('identificador');////resolver esto despues
        res.status(200).json(JSON.stringify(segunda_call));
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

function consulta1(conexion,req,next){
    return new Promise((resolve,reject)=>comprobacion_logeo(resolve,reject,conexion,req,next))
}
/////supongo que hara otra cosa en lugar de ejecutar query
function consulta2(usuario){
    return new Promise((resolve,reject)=>identificacion_logeo(resolve,reject,usuario))
}
///////esto deberia generar sus tokens nuevos
function identificacion_logeo(resolve,reject,usuario){
    // console.log(usuario);
    // let user_campos=Object.values(usuario);
    let autenticado=jwtgenerator(usuario);
    
    resolve(autenticado);
}

module.exports={logeo}
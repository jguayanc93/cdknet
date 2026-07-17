require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {cuota_existe} = require('../../querys/cuota/revisar_registro')
let {registro_cuota} = require('../../querys/cuota/registrar')
let {cuota_tiempo} = require('../../querys/cuota/mostrar')
// let {cuota_avance_cobertura} = require('../../querys/cuota/cobertura')
let {avance_items_recojidos} = require('../../querys/cuota/desechar_vendido')
let {cuota_avance_objetivo_especifico} = require('../../querys/cuota/objetivo_specifico')
let {cuota_items_desechables} = require('../../querys/cuota/desechar_items')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function cuota_item_desechable(req,res,next) {
    try{
        const primera_call = await consulta1(req);//galletas
        const segunda_call = await consulta2(req);//diferenciador
        const tercer_call = await obtenerpromesa_conexion();
        const setima_call = await consulta5(tercer_call,primera_call,segunda_call);//items vendidos tienen duplicados
        // const cuarta_call = await obtenerpromesa_conexion();
        // const octava_call = await consulta6(cuarta_call,setima_call,quinta_call);
        // const novena_call = await consulta7(octava_call);
        const decima_call = await obtenerpromesa_conexion();
        const onceava_call = await consulta8(decima_call,primera_call,segunda_call);
        const doceava_call = await consulta9(onceava_call,setima_call);
        
        res.status(200).json({"simple":doceava_call});
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req)) }

function consulta2(req){ return new Promise((resolve,reject)=>galleta_tipo(resolve,reject,req)) }

function consulta5(conexion,galleta,diferenciador){ return new Promise((resolve,reject)=>avance_items_recojidos(resolve,reject,conexion,galleta,diferenciador)) }

function consulta6(tiempos,monto,textodia){ return new Promise((resolve,reject)=>estimacion_monto(resolve,reject,tiempos,monto,textodia)) }

function consulta7(montos){ return new Promise((resolve,reject)=>calculo_porcentaje(resolve,reject,montos)) }

function consulta8(conexion,galleta,diferenciador){ return new Promise((resolve,reject)=>cuota_items_desechables(resolve,reject,conexion,galleta,diferenciador)) }

function consulta9(arrobj,vendidos){ return new Promise((resolve,reject)=>calculo_avance_objetivo_especifico(resolve,reject,arrobj,vendidos)) }

function calculo_avance_objetivo_especifico(resolve,reject,arrobj,vendidos){
    ////lo que se pretende hacer ahora es pasar todos los items del obj a un solo array
    const codigos=[];
    for(let codi of arrobj){
        ///ya tengo los codis guardados en un array listo para buscar
        codigos.push(codi[0])
    }
    ///ahora deberia buscar los items vendidos en los desechables
    const acumulados={};
    for(let item of vendidos){
        if(codigos.includes(item[1])){
            if(Object.keys(acumulados).includes(item[1])){
                acumulados[item[1]][3]=acumulados[item[1]][3]+item[3];
            }
            else{
                acumulados[item[1]]=[item[0],item[1],item[2],item[3]];
            }
        }
    }
    resolve (acumulados);
}

function calculo_porcentaje(resolve,reject,objformato){    
    let cuota_fijada=objformato["meta"];
    let cuota_objspecifico= Number(((cuota_fijada*objformato["objesp"])/100).toFixed(3));
    objformato["objspec_cuota"]=cuota_objspecifico;
    resolve(objformato);
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

function galleta_tipo(resolve,reject,req){
    /////esta galleta solo esta firmada no esta en un jws
    let tipo=req.signedCookies.tip;
    if(typeof tipo ==='string'){
        resolve(tipo)
    }
    else{reject("falsa galleta")}
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
    objformato["codfam"]=tiempos[9];
    objformato["objesp"]=tiempos[10];

    resolve(objformato);
}



module.exports={cuota_item_desechable}
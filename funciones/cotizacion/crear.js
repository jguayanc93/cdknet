require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
let {tipo_cambio} = require('../../querys/cotizacion/tipcambio');
let {num_correlativo} = require('../../querys/cotizacion/correlativo')
let {correlativo_update} = require('../../querys/cotizacion/correlativo_update')
let {coti_atencion} = require('../../querys/cotizacion/atencion')
let {coti_cabecera} = require('../../querys/cotizacion/crear_cabecera')
let {coti_detallado} = require('../../querys/cotizacion/crear_detallado')
let {cotizacion_registrar_vendedor} = require('../../querys/cotizacion//otorgar_cotizacion')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function creacion(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const segundo_call = await consulta2(req.body);//totalisados para la cabecera
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call);//tipo de cambio
        const quinta_call = await obtenerpromesa_conexion();
        const sexta_call = await consulta4(quinta_call);//correlativo actual
        const setima_call = await obtenerpromesa_conexion();
        const octava_call = await consulta5(setima_call,sexta_call);//actualisar el correlativo en la tabla
        const novena_call = await obtenerpromesa_conexion();
        const decima_call = await consulta6(novena_call,req.body["cliente"][0]);//atencion del cliente
        const undecima_call = await obtenerpromesa_conexion();
        const doceava_call= await consulta7(undecima_call,cuarta_call,sexta_call,req.body["cliente"],decima_call,segundo_call);
        ////CONSTRUIDO CON EXITO EL MST FALTA EL DETALLADO
        const treceava_call = await obtenerpromesa_conexion();
        const catorceava_call = await consulta8(treceava_call,req.body,segundo_call[0],cuarta_call,sexta_call);
        ////OTORGARLE LA COTI AL VENDEDOR
        const quinceava_call = await obtenerpromesa_conexion();
        const diecisesava_call = await consulta9(quinceava_call,primera_call,sexta_call);

        // res.status(200).json(JSON.stringify(tercer_call));
        res.status(200).json(JSON.stringify({"catorceava":diecisesava_call}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(dataenviada){ return new Promise((resolve,reject)=>calcular(resolve,reject,dataenviada)) }

function consulta3(conexion){ return new Promise((resolve,reject)=>tipo_cambio(resolve,reject,conexion)) }

function consulta4(conexion){ return new Promise((resolve,reject)=>num_correlativo(resolve,reject,conexion)) }

function consulta5(conexion,correlativo){ return new Promise((resolve,reject)=>correlativo_update(resolve,reject,conexion,correlativo)) }

function consulta6(conexion,codcli){ return new Promise((resolve,reject)=>coti_atencion(resolve,reject,conexion,codcli)) }

function consulta7(conexion,fecha,formato,info_cliente,atencion,totalisado){
    return new Promise((resolve,reject)=>coti_cabecera(resolve,reject,conexion,fecha,formato,info_cliente,atencion,totalisado))
}

function consulta8(conexion,info_cliente,objtotal,fecha,formato){
    return new Promise((resolve,reject)=>coti_detallado(resolve,reject,conexion,info_cliente,objtotal,fecha,formato))
};

function consulta9(conexion,galleta,documento){
    return new Promise((resolve,reject)=>cotizacion_registrar_vendedor(resolve,reject,conexion,galleta,documento))
};

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
    let objtotal={};
    let totalisado=0;
    for(let indice in dataenviada["productos"]){
        let descripcion=dataenviada["productos"][indice][0];
        let cantidad=parseInt(dataenviada["productos"][indice][1]);
        let costo=parseFloat(dataenviada["productos"][indice][2]).toFixed(2);
        let preu=parseFloat(dataenviada["productos"][indice][3]);
        let dsct=parseFloat(dataenviada["productos"][indice][4]);
        let codf=dataenviada["productos"][indice][5];
        let marca=dataenviada["productos"][indice][6];
        let saca_descuento=dsct/100;
        let saca_tota_por_descuento=(preu*saca_descuento).toFixed(2);
        let saca_tota_con_descuento=(preu-saca_tota_por_descuento).toFixed(2);
        let saca_total=saca_tota_con_descuento*cantidad;
        let total_solo_item=saca_total.toFixed(2);
        let total_solo_item_igv=(saca_total*0.18).toFixed(2);
        let total_solo_item_conigv=(saca_total*1.18).toFixed(2);
        // objtotal[indice]=[total_solo_item,total_solo_item_igv,total_solo_item_conigv];
        ////creacion del molde para el objeto globlal de productos
        objtotal[indice]=[codf,marca,descripcion,cantidad,preu,total_solo_item,dsct,total_solo_item_conigv,costo];
        totalisado+=saca_total;
    }
    resolve([objtotal,totalisado])
}

module.exports={creacion}
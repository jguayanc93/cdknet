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
let {recuperar_detallado} = require('../../querys/cotizacion/crear_recuperador')
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function new_creacion(req,res,next) {
    try{
        const primera_call = await consulta1(req,next);//galletas
        const tercer_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta3(tercer_call);//tipo de cambio
        const activar = await obtenerpromesa_conexion();
        const recuperar_call = await recuperador(activar,req.body["productos"]);///items recuperados de la BD
        const segundo_call = await consulta2(recuperar_call,cuarta_call,req.body["productos"],req.body["moneda"]);//totalisados para la cabecera
        const quinta_call = await obtenerpromesa_conexion();
        const sexta_call = await consulta4(quinta_call);//correlativo actual
        const setima_call = await obtenerpromesa_conexion();
        const octava_call = await consulta5(setima_call,sexta_call);//actualisar el correlativo en la tabla
        const novena_call = await obtenerpromesa_conexion();
        const decima_call = await consulta6(novena_call,req.body["cliente"][0]);//atencion del cliente
        const undecima_call = await obtenerpromesa_conexion();
        const doceava_call= await consulta7(undecima_call,cuarta_call,sexta_call,req.body["cliente"],decima_call,segundo_call,req.body["moneda"]);
        ////CONSTRUIDO CON EXITO EL MST FALTA EL DETALLADO
        const treceava_call = await obtenerpromesa_conexion();
        const catorceava_call = await consulta8(treceava_call,req.body,segundo_call[0],cuarta_call,sexta_call);
        // ////OTORGARLE LA COTI AL VENDEDOR
        const quinceava_call = await obtenerpromesa_conexion();
        const diecisesava_call = await consulta9(quinceava_call,primera_call,sexta_call);

        res.status(200).json(JSON.stringify({"success":true}));
        // res.status(200).json(JSON.stringify({"contenido":catorceava_call}));
    }
    catch(err){
        error_corrector(res,err);
    }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function recuperador(conexion,productos){ return new Promise((resolve,reject)=>recuperar_detallado(resolve,reject,conexion,productos)) }

function consulta1(req,next){ return new Promise((resolve,reject)=>galleta_credencial(resolve,reject,req,next)) }

function consulta2(recuperada,tipocambio,dataenviada,moneda){ return new Promise((resolve,reject)=>calcular_moneda(resolve,reject,recuperada,tipocambio,dataenviada,moneda)) }

function consulta3(conexion){ return new Promise((resolve,reject)=>tipo_cambio(resolve,reject,conexion)) }

function consulta4(conexion){ return new Promise((resolve,reject)=>num_correlativo(resolve,reject,conexion)) }

function consulta5(conexion,correlativo){ return new Promise((resolve,reject)=>correlativo_update(resolve,reject,conexion,correlativo)) }

function consulta6(conexion,codcli){ return new Promise((resolve,reject)=>coti_atencion(resolve,reject,conexion,codcli)) }

function consulta7(conexion,fecha,formato,info_cliente,atencion,totalisado,moneda){
    return new Promise((resolve,reject)=>coti_cabecera(resolve,reject,conexion,fecha,formato,info_cliente,atencion,totalisado,moneda))
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

function calcular(resolve,reject,dataenviada,tipocambio){
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
function calcular_moneda(resolve,reject,recuperada,tipocambio,dataenviada,moneda){
    let objtotal={};
    let totalisado=0;
    if(moneda=='S'){
        let tip_cambio=tipocambio[0];

        for(let indice in dataenviada["productos"]){
            let descripcion=dataenviada["productos"][indice][0];
            let cantidad=parseInt(dataenviada["productos"][indice][1]);
            let costo=parseFloat(dataenviada["productos"][indice][2]).toFixed(2);
            let preu=parseFloat(dataenviada["productos"][indice][3]);
            let dsct=parseFloat(dataenviada["productos"][indice][4]);
            ///////////////////calcular en soles
            let costo_sol= Number((costo*tip_cambio).toFixed(2));
            let preu_sol=Number((preu*tip_cambio).toFixed(2));
            ////////////
            let codf=dataenviada["productos"][indice][5];
            let marca=dataenviada["productos"][indice][6];
            ////calcular moneda
            let saca_descuento=dsct/100;
            //////////
            let saca_tota_por_descuento=Number((preu_sol*saca_descuento).toFixed(2));
            let saca_tota_con_descuento=Number((preu_sol-saca_tota_por_descuento).toFixed(2));
            let saca_total=saca_tota_con_descuento*cantidad;
            let total_solo_item=saca_total.toFixed(2);
            let total_solo_item_igv=(saca_total*0.18).toFixed(2);
            let total_solo_item_conigv=(saca_total*1.18).toFixed(2);
            // objtotal[indice]=[total_solo_item,total_solo_item_igv,total_solo_item_conigv];
            ////creacion del molde para el objeto globlal de productos
            objtotal[indice]=[codf,marca,descripcion,cantidad,preu_sol,total_solo_item,dsct,total_solo_item_conigv,costo_sol];
            totalisado+=saca_total;
        }
    }
    else{
        for(let indice in dataenviada){

            if(Object.keys(recuperada).includes(dataenviada[indice]["codigo"])){
                let descripcion=recuperada[dataenviada[indice]["codigo"]][4];
                let cantidad=dataenviada[indice]["cantidad"];
                let costo=recuperada[dataenviada[indice]["codigo"]][6];
                let preu=dataenviada[indice]["precioUnitario"];
                let dsct=dataenviada[indice]["descuento"];
                let codf=recuperada[dataenviada[indice]["codigo"]][1];
                let marca=recuperada[dataenviada[indice]["codigo"]][2];
                let total_solo_item=dataenviada[indice]["preciosinIGV"];
                let total_solo_item_conigv=Number((total_solo_item*1.18).toFixed(2));
                
            objtotal[dataenviada[indice]["codigo"]]=[codf,marca,descripcion,cantidad,preu,total_solo_item,dsct,total_solo_item_conigv,costo];
            ///aun falta corregir el totalisado con igv para la suma general
            totalisado+=total_solo_item;
            }
        // let descripcion=dataenviada["productos"][indice][0];
        // let cantidad=parseInt(dataenviada["productos"][indice][1]);
        // let costo=parseFloat(dataenviada["productos"][indice][2]).toFixed(2);
        // let preu=parseFloat(dataenviada["productos"][indice][3]);
        // let dsct=parseFloat(dataenviada["productos"][indice][4]);
        // let codf=dataenviada["productos"][indice][5];
        // let marca=dataenviada["productos"][indice][6];
        // let saca_descuento=dsct/100;
        // let saca_tota_por_descuento=(preu*saca_descuento).toFixed(2);
        // let saca_tota_con_descuento=(preu-saca_tota_por_descuento).toFixed(2);
        // let saca_total=saca_tota_con_descuento*cantidad;
        // let total_solo_item=saca_total.toFixed(2);
        // let total_solo_item_igv=(saca_total*0.18).toFixed(2);
        // let total_solo_item_conigv=(saca_total*1.18).toFixed(2);
        // // objtotal[indice]=[total_solo_item,total_solo_item_igv,total_solo_item_conigv];
        // ////creacion del molde para el objeto globlal de productos
        // objtotal[indice]=[codf,marca,descripcion,cantidad,preu,total_solo_item,dsct,total_solo_item_conigv,costo];
        // totalisado+=saca_total;
        }
    }
    resolve([objtotal,totalisado])
}

module.exports={new_creacion}
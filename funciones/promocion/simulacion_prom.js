require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {promocion_id} = require('../../querys/promocion/promocion_id')
let {coti_contiene_promocion} = require('../../querys/promocion/promocion_en_cotizacion')
let {coti_detallado} = require('../../querys/promocion/prom_buscar_cabecera')

let {prom_cabeza_seccion1} = require('../../querys/promocion/promheader_simple1')
let {prom_detallado_seccion2} = require('../../querys/promocion/promdetail_simple2') 

///////ESPACIO PARA FUNCIONES GENERALES
let v_xitems = require('./xitems')
let v_xitotalisado = require('./xtotalisados')
let descuento = require('./descuento')
let bonificacion = require('./bonificacion')
//////NUEVAS FUNCIONES PARA REEMPLAZAR LAS BIFURCACIONES DE PROMOCION QUE TIENE
let por_ITEM = require('./porItem')
let por_TOTALVENTA = require('./porTotalVenta')
///NUEVAS FUNCIONES PARA MANEJAR LA PROMO OBTENIDA EJEM DESCUENTO O REGALO
let descuento_acomodado = require('./acomodar_descuento')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')
//////////SE DEBE CORREGIR TODO
async function prom_temporal_mejorada(req,res,next) {
    try{
        // const primera_call = await obtenerpromesa_conexion();
        const segunda_call = await consulta1(req.body);//items seleccionados que pueden variar
        const tercera_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta2(tercera_call,req.body);//promocion cabecera
        const quinta_call = await consulta3(cuarta_call);//DIFERENCIA LAS PROMOS PARA QUE?
        const octava_call = await obtenerpromesa_conexion();
        const novena_call = await consulta6(octava_call,req.body.codigo);///promocion detallado
        /////falta como direccionar bien las 4 lados de una promo
        // const decima_call = await consulta7(req.body.nprom,segunda_call,cuarta_call,novena_call,quinta_call,sexta_call);
        const decima_call = await consulta7(segunda_call[0],segunda_call[1],quinta_call,cuarta_call,novena_call);

        // const onceava_call = await consulta8(segunda_call[0],);

        res.status(200).json(JSON.stringify(decima_call));
        
    }
    catch(err){ error_corrector(res,err); }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(body){ return new Promise((resolve,reject)=>items_extracto(resolve,reject,body)) }

function consulta2(conexion,body){ return new Promise((resolve,reject)=>prom_cabeza_seccion1(resolve,reject,conexion,body)) }

function consulta3(promocion){ return new Promise((resolve,reject)=>nuevo_separador_tipos(resolve,reject,promocion)) }

function consulta6(conexion,codigo){ return new Promise((resolve,reject)=>prom_detallado_seccion2(resolve,reject,conexion,codigo)) }

// function consulta7(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica){
//     return new Promise((resolve,reject)=>direccionador(resolve,reject,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica)) 
// }
function consulta7(codigos,cotdetalle,tipopromo,promcabesa,promdetalle){
 return new Promise((resolve,reject)=>que_venta(resolve,reject,codigos,cotdetalle,tipopromo,promcabesa,promdetalle))
}

function consulta8(conexion){ return new Promise((resolve,reject)=>direccionador2(resolve,reject,conexion)) }

/////////////funciones diferenciales de captura de items
function items_extracto(resolve,reject,listado){
    let temporal=listado.productos;
    let codigos=[];
    let extracto={};
    for(let i in temporal){
        codigos.push(temporal[i].codigo);
        extracto[temporal[i].codigo] = temporal[i];
    }
    ///regresando un arreglo de los codis y un objeto con los datos de los items, para poder hacer la comparacion con la promocion
    resolve([codigos, extracto]);
}
/////////////funcion simple para separar el tipo de promo en un objeto movible
function nuevo_separador_tipos(resolve,reject,respuesta2){
    let tipo_prom={};
    tipo_prom["idprom"]=respuesta2[0];
    tipo_prom["nombre"]=respuesta2[1];
    tipo_prom["descripcion"]=respuesta2[2];
    tipo_prom["venta"]=respuesta2[3];///puede ser ITEM O TOTAL VENTA
    tipo_prom["descuento"]=respuesta2[4];///puede ser DESCUENTO O REGALO
    tipo_prom["otorga"]=respuesta2[5];///puede ser MONTO O UNIDADES
    tipo_prom["metrica"]=respuesta2[6];///puede ser (LA VENTA) EN VALORIZADO O UNIDADES
    tipo_prom["agrupado"]=respuesta2[9];///puede ser 0 QUE ES NO AGRUPADO O 1 QUE TIENE OTRA PROMOCION AGRUPADA    
    resolve(tipo_prom);
}
/////////////funcion para bifurcar la direccion de la promo segun el tipo de promo y la metrica
function que_venta(resolve,reject,codigos,cotdetalle,tipopromo,promcabesa,promdetalle){
    let respuesta_devuelta;
    if(tipopromo["venta"]==1){
        respuesta_devuelta=por_ITEM(codigos,cotdetalle,tipopromo,promcabesa,promdetalle);
    }
    else{
        respuesta_devuelta=por_TOTALVENTA(codigos,cotdetalle,tipopromo,promcabesa,promdetalle);
    }
    resolve(respuesta_devuelta);
}
///////////////////////////////////////////////////////////////////////
function direccionador(resolve,reject,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica){
    let respuesta_devuelta;    
    if(tipopromo[0]==1){
        respuesta_devuelta=v_xitems(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica);
    }
    else{respuesta_devuelta=v_xitotalisado(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica);}
    resolve(respuesta_devuelta);
}

function direccionador2(resolve,reject){
    if(respuesta_devuelta.length===0){
        ////RETORNO DE LA RESPUESTA QUE NO CUMPLIO LA PROMO
        res.status(401).send("no promo aplicable");
    }
    else{
    ///////////////////
    if(tipopromo[1]==1){
        // promo_terminada=descuento(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta[0],respuesta_devuelta[1]);
        // descuento(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta[0],respuesta_devuelta[1],respuesta_devuelta[2],respuesta_devuelta[3],respuesta_devuelta[4]);
        descuento(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta);
    }
    else{
        // promo_terminada=bonificacion(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,items_validos2,items_promos2);
        // bonificacion(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta[0],respuesta_devuelta[1],respuesta_devuelta[2]);
        bonificacion(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta);
    }
    
    }
}

module.exports={prom_temporal_mejorada}
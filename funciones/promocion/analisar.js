require('dotenv').config();
const jws = require('jws');

const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {promocion_id} = require('../../querys/promocion/promocion_id')
let {coti_contiene_promocion} = require('../../querys/promocion/promocion_en_cotizacion')
let {coti_detallado} = require('../../querys/promocion/prom_buscar_cabecera')
let {prom_buscar_cabecera} = require('../../querys/promocion/prom_buscar_cabecera2')
let {prom_buscar_detallado} = require('../../querys/promocion/prom_buscar_detallado')
///////ESPACIO PARA FUNCIONES GENERALES
let v_xitems = require('./xitems')
let v_xitotalisado = require('./xtotalisados')
let descuento = require('./descuento')
let bonificacion = require('./bonificacion')
////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')
//////////SE DEBE CORREGIR TODO
async function prom_adjuntar(req,res,next) {
    try{
        const primera_call = await obtenerpromesa_conexion();
        const segunda_call = await consulta1(primera_call,req.body);//coti detallado
        const tercera_call = await obtenerpromesa_conexion();
        const cuarta_call = await consulta2(tercera_call,req.body);//promocion cabecera
        const quinta_call = await consulta3(cuarta_call);//encontrado
        const sexta_call = await consulta4(cuarta_call);//numero_metrica
        const setima_call = await consulta5(cuarta_call);//saber_grupo
        
        const octava_call = await obtenerpromesa_conexion();
        const novena_call = await consulta6(octava_call,req.body);///promocion detallado
        /////usare esta funcion como trampolin para direccionarme a su debido lugar
        const decima_call = await consulta7(req.body.nprom,segunda_call,cuarta_call,novena_call,quinta_call,sexta_call);
        const onceava_call = await obtenerpromesa_conexion();
        ////usare esta otro trampolin para darle lo merecido segun promo
        // INTENTARE USAR UNA DIRECCION DIFERENTE POR MIENTRAS
        if(decima_call.length===0){
            onceava_call.close();
            res.status(401).send("no promo aplicable");
        }
        else{
            if(quinta_call[1]===1){
                onceava_call.close();
                // descuento(res,req.body.nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,decima_call);
                descuento(res,req.body.nprom,segunda_call,cuarta_call,novena_call,quinta_call,sexta_call,decima_call);
            }
            else{
                // bonificacion(res,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,respuesta_devuelta);
                bonificacion(res,req.body.nprom,segunda_call,cuarta_call,novena_call,quinta_call,sexta_call,decima_call,onceava_call);
            }
        }
        // res.status(200).json(decima_call);////aca si va a estar yuca enviar la respuesta
    }
    catch(err){ error_corrector(res,err); }
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,body){ return new Promise((resolve,reject)=>coti_detallado(resolve,reject,conexion,body)) }

function consulta2(conexion,body){ return new Promise((resolve,reject)=>prom_buscar_cabecera(resolve,reject,conexion,body)) }

function consulta3(promocion){ return new Promise((resolve,reject)=>buscar_tipo(resolve,reject,promocion)) }

function consulta4(promocion){ return new Promise((resolve,reject)=>buscar_metrica(resolve,reject,promocion)) }

function consulta5(promocion){ return new Promise((resolve,reject)=>buscar_grupo(resolve,reject,promocion)) }

function consulta6(conexion,body){ return new Promise((resolve,reject)=>prom_buscar_detallado(resolve,reject,conexion,body)) }

function consulta7(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica){ return new Promise((resolve,reject)=>direccionador(resolve,reject,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica)) }

function consulta8(conexion){ return new Promise((resolve,reject)=>direccionador2(resolve,reject,conexion)) }

function direccionador(resolve,reject,nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica){
    let respuesta_devuelta;
    // let promo_terminada;
    
    if(tipopromo[0]==1){
        respuesta_devuelta=v_xitems(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica);
    }
    else{
        respuesta_devuelta=v_xitotalisado(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica);
    }

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
    // res.status(200).json(respuesta_devuelta)
    // res.status(200).json(promo_terminada)
    }
}

function buscar_tipo(resolve,reject,respuesta2){
    const posibilidades={
    "tipo111":[1,1,1],
    "tipo113":[1,1,3],///ya esta
    "tipo131":[1,3,1],///ya esta
    "tipo133":[1,3,3],
    "tipo311":[3,1,1],
    "tipo313":[3,1,3],///ya esta
    "tipo331":[3,3,1],///ya esta
    "tipo333":[3,3,3]
}
    let buscar_tipo=[respuesta2[3],respuesta2[4],respuesta2[5]];    
    let encontrado="no found";

    for(let i in posibilidades){
        if(posibilidades[i].toString()==buscar_tipo.toString()) encontrado=posibilidades[i];
    }
    // return encontrado;
    resolve(encontrado)

}

function buscar_metrica(resolve,reject,respuesta2){
    let tipo_metrica=respuesta2[6];
    // return tipo_metrica;
    resolve(tipo_metrica)
}

function buscar_grupo(resolve,reject,respuesta2){
    let tipo_grupo=respuesta2[9];
    // return tipo_grupo;
    resolve(tipo_grupo)
}



module.exports={prom_adjuntar}
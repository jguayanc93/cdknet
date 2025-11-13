require('dotenv').config();
const jws = require('jws');

// const {conn} = require('../../conexion/cnn')
/////////espacio para la llamada de los querys
// let {} = require('../../querys/producto/identificar');
///////ESPACIO PARA FUNCIONES GENERALES

////ESPACIO PARA LOS MANEJOS DE ERRORES CON RESPUESTA
const {error_corrector} = require('../error/err1')

async function rentabilidad(req,res,next) {
    try{
        const primera_call= await consulta1(req,next);
        // const segundo_call= await obtenerpromesa_conexion();
        // const tercer_call= await consulta2(segundo_call,req,next);

        res.status(200).json(primera_call);
    }
    catch(err){
        error_corrector(res,err);
    }
}

// function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(req,next){
    return new Promise((resolve,reject)=>productos_rentabilidad(resolve,reject,req,next))
}

function productos_rentabilidad(resolve,reject,req,next){
    let productos = req.body.productos;
    
    let filtrado={};
    for(let indice in productos){
        ///////////solo para el nombre
        let nombre=objeto[indice][0];
        ///////////solo para cantidad
        let cantidad=parseInt(objeto[indice][1]);
        ///////////solo para venta
        let venta=objeto[indice][3];
        ///////////solo para el descuento concedido
        let descuento=objeto[indice][4];
        ////solo para el totalisado
        let saca_descuento=parseFloat(objeto[indice][4])/100;
        let saca_tota_por_descuento= (parseFloat(objeto[indice][3])*saca_descuento).toFixed(2);
        let saca_tota_con_descuento= (parseFloat(objeto[indice][3])-saca_tota_por_descuento).toFixed(2);
        let totalisado=saca_tota_con_descuento*objeto[indice][1];
        ///////solo para el costo total
        let saca_costo=parseFloat(objeto[indice][2]).toFixed(2)*parseInt(objeto[indice][1]);
        //////solo para la diferencia
        let diferencia=(totalisado-(saca_costo).toFixed(2)).toFixed(2);
        /////solo para rentabilidad
        let rentabilidad=(diferencia/saca_costo).toFixed(4);
        ////RENTABILIDAD EN PORCENTAJE BORRAR MAS ADELANTE
        let renta=(parseFloat(rentabilidad)*100).toFixed(3);

        filtrado[indice]=[nombre,cantidad,venta,descuento,saca_costo,totalisado,diferencia,renta];
    }

    resolve(filtrado);
    
}

module.exports={rentabilidad}
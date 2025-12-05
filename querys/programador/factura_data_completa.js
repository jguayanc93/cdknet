require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programar_factura_data_completa = (resolve,reject,conexion,factura_data)=>{

    let sq_sql="jc_factura_despacho_identificador";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("factura extraccion falla");
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                Object.assign(respuesta2,respuesta);
                resolve(respuesta2[0]);
            }
        }
    })
    consulta.addParameter('factura',TYPES.VarChar,factura_data[2]);
    consulta.addParameter('entrega',TYPES.Int,factura_data[0]);
    conexion.callProcedure(consulta);
}

module.exports={programar_factura_data_completa}
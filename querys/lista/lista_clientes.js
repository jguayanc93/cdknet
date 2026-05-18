require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let seleccion_clientes = (resolve,reject,conexion,galleta,body)=>{

    let vendedor= galleta.codigo;
    let eleccion=body.tipo;

    let sq_sql="jc_lista_clientes";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("no tienes clientes");
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
                resolve(respuesta2);
            }
        }
    })
    consulta.addParameter('codven',TYPES.VarChar,vendedor);
    consulta.addParameter('lista',TYPES.VarChar,eleccion);
    conexion.callProcedure(consulta);
}

module.exports={seleccion_clientes}
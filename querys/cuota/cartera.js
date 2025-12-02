require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_avance_cartera = (resolve,reject,conexion,galleta,diferenciador)=>{

    let sq_sql="";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("cuota no existe");
            }
            else{
                let respuesta=[];                
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
                
                resolve(respuesta[0]);
            }
        }
    })
    consulta.addParameter('codusu',TYPES.VarChar,galleta.identificador);
    conexion.execSql(consulta);
}

module.exports={cuota_avance_cartera}
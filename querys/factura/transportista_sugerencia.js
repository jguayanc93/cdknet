require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let factura_sugerencia_transportista = (resolve,reject,conexion,body)=>{
    
    let caracter = "%"+body.sugerencia+"%";

    let sq_sql="select top 5 codtra,nomtra from tbl01tra where estado=1 and nomtra like @pista";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("factura no asignada");
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
    consulta.addParameter('pista',TYPES.VarChar,caracter);
    conexion.execSql(consulta);
}

module.exports={factura_sugerencia_transportista}
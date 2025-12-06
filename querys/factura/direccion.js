require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let factura_info_direccion = (resolve,reject,conexion,galleta,body)=>{

    let vendedor= galleta.codigo;
    let documento = body.opc1;

    let sq_sql="select a.dirent from mst01fac a where a.cdocu in ('01','03') AND a.flag<>'*' AND a.ndge='' AND a.codven_usu=@codven AND a.ndocu=@doc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("cotizacion no registrada");
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
    consulta.addParameter('doc',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={factura_info_direccion}
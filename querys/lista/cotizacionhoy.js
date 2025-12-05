require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_de_hoy = (resolve,reject,conexion,galleta)=>{

    let vendedor= galleta.codigo;

    let sq_sql="select CONVERT(varchar,fecha,111),ndocu,nomcli,totn,(case cdge when '' then 'cotizado' when '01' then 'facturado' when '03' then 'boleta' when '32' then 'pedido' end) from mst01cot where YEAR(fecha)=YEAR(GETDATE()) and MONTH(fecha)=CONVERT(varchar(2),GETDATE(),101) and DAY(fecha)=CONVERT(varchar(2),GETDATE(),103) and codven_usu=@codven";
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
    conexion.execSql(consulta);
}

module.exports={coti_de_hoy}
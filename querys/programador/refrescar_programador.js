require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programador_refrescar_lista = (resolve,reject,conexion,galleta)=>{

    let factura= galleta.codigo;

    let sq_sql="select CONVERT(varchar,a.fecha,111),a.ndocu,a.nomcli,(case a.TipEnt when 1 then 'ventanilla' when 3 then 'Lima' when 4 then 'Provincia' end) from mst01fac a LEFT OUTER JOIN tbl01_api_programar b on (a.ndocu=b.documento) where b.documento IS NULL AND YEAR(a.fecha)=YEAR(GETDATE()) AND MONTH(a.fecha)=MONTH(GETDATE()) and DAY(a.fecha)=CONVERT(varchar(2),GETDATE(),103) AND cdocu in('01','03') AND a.flag<>'*' AND a.cdge='' AND codven_usu=@codven";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("factura con guia");
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
    consulta.addParameter('codven',TYPES.VarChar,factura);
    conexion.execSql(consulta);
}

module.exports={programador_refrescar_lista}
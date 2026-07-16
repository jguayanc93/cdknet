require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_items_desechables = (resolve,reject,conexion,galleta,objformato)=>{

    // let sq_sql="select SUM(CASE mone WHEN 'D' THEN tota WHEN 'S' THEN tota/tcam END) from mst01fac where YEAR(fecha)=YEAR(GETDATE()) AND MONTH(fecha)=MONTH(GETDATE()) AND flag<>'*' AND codvta<>'04' AND codven_usu=@codven";
    let sq_sql="select codigo from tbl_api_items_desechables";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            if(rows.length==0){ reject("ningun desechable"); }
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
                
                resolve(respuesta);
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={cuota_items_desechables}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let avance_items_recojidos = (resolve,reject,conexion,galleta,diferenciador)=>{
    
    let sq_sql="select a.ndocu,a.codi,a.descr,a.cant from dtl01fac a inner join mst01fac b on (b.ndocu=a.ndocu) where YEAR(b.fecha)=YEAR(GETDATE()) AND MONTH(b.fecha)=MONTH(GETDATE()) AND b.flag<>'*' AND b.codvta<>'04' AND a.codi<>'0303-010001' AND b.codven_usu=@codven";
    // let sq_sql="select a.ndocu,a.codi,a.descr,a.cant from dtl01fac a inner join mst01fac b on (b.ndocu=a.ndocu) where YEAR(b.fecha)=YEAR(GETDATE()) AND MONTH(b.fecha)=7 AND b.flag<>'*' AND b.codvta<>'04' AND a.codi<>'0303-010001' AND b.codven_usu=@codven";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("ninguna venta");
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
                
                resolve(respuesta);
            }
        }
    })
    consulta.addParameter('codven',TYPES.VarChar,galleta.codigo);
    conexion.execSql(consulta);
}

module.exports={avance_items_recojidos}
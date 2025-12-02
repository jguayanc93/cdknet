require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_avance_cobertura = (resolve,reject,conexion,galleta,diferenciador)=>{

    let sq_sql="select SUM(tota) from mst01fac where YEAR(fecha)=YEAR(GETDATE()) AND MONTH(fecha)=MONTH(GETDATE()) AND flag<>'*' AND codvta<>'04' AND codven_usu=@codven";
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
                
                resolve(respuesta[0][0]);
            }
        }
    })
    consulta.addParameter('codven',TYPES.VarChar,galleta.codigo);
    conexion.execSql(consulta);
}

module.exports={cuota_avance_cobertura}
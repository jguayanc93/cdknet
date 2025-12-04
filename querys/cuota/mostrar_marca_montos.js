require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_marca_monto_estimado = (resolve,reject,conexion,body)=>{

    let codmar=body.codigo;
    
    let sq_sql="select monto,avance,costo,rentabilidad from tbl01api_jefaturas_meta where anno=YEAR(GETDATE()) AND mes=MONTH(GETDATE()) AND codmar=@codmar";
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
    consulta.addParameter('codmar',TYPES.VarChar,codmar);
    conexion.execSql(consulta);
}

module.exports={cuota_marca_monto_estimado}
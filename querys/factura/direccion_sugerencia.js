require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let factura_sugerencia_direccion = (resolve,reject,conexion,body)=>{
    
    let caracter = "%"+body.sugerencia+"%";
    let cli = body.cli;

    let sq_sql="select dirent from mst01cli where codcli=@cliente1 union select dirent from Dtl_Cliente_Alias where codcli=@cliente2 and dirent<>'' and dirent like @sugerencia";
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
    consulta.addParameter('cliente1',TYPES.VarChar,cli);
    consulta.addParameter('cliente2',TYPES.VarChar,cli);
    consulta.addParameter('sugerencia',TYPES.VarChar,caracter);
    conexion.execSql(consulta);
}

module.exports={factura_sugerencia_direccion}
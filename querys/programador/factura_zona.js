require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programar_items_zona = (resolve,reject,conexion,factura_data)=>{

    let sq_sql="select almacen.zona from dtl01fac items join tbl01_api_almacen_zonas almacen on almacen.codi=items.codi where items.ndocu=@documento and items.codi<>'0303-010001' group by almacen.zona";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("zonas no encontradas");
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
                let zones=[];
                for(let zone of respuesta) zone[0]=='' ? zones.push("desconocido") : zones.push(zone[0])
                resolve(zones);
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,factura_data[2]);
    conexion.execSql(consulta);
}

module.exports={programar_items_zona}
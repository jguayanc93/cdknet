require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programar_revisar_entrega = (resolve,reject,conexion,factura_data,zonas)=>{

    let sq_sql="select documento,fecha,hora,minutos from tbl01_api_programar where documento=@doc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                resolve("valido");
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

                let factura_programada=[];
                for(let factura in respuesta2){ if(respuesta2[factura][0]==factura_data[2]) factura_programada.push(respuesta2[factura][0]); }

                if(factura_programada.length>0){
                    reject("factura ya programada");
                }
            }
        }
    })
    // consulta.addParameter('date',TYPES.VarChar,factura);
    consulta.addParameter('doc',TYPES.VarChar,factura_data[2]);
    conexion.execSql(consulta);
}

module.exports={programar_revisar_entrega}
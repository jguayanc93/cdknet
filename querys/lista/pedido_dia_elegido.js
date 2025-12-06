require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let pedi_dia_elegido = (resolve,reject,conexion,galleta,body)=>{

    let vendedor= galleta.codigo;
    let fecha_elegida=body.dia;
    let dia = fecha_elegida.substring(8);

    let sq_sql="select CONVERT(varchar,fecha,111),ndocu,nomcli,totn,(case flag when '1' then 'atendido' when '0' then 'aprobado' end) from mst01ped where flag<>'*' and YEAR(fecha)=2025 and MONTH(fecha)=CONVERT(varchar(2),GETDATE(),101) and DAY(fecha)=@dia and codven_usu=@codven";
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
    consulta.addParameter('dia',TYPES.VarChar,dia);
    consulta.addParameter('codven',TYPES.VarChar,vendedor);
    conexion.execSql(consulta);
}

module.exports={pedi_dia_elegido}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let factura_sugerencia_vendedor = (resolve,reject,conexion,galleta,body)=>{
    
    let documento = body.opc1;

    let sq_sql="select a.TipEnt,b.despacho from mst01fac a inner join tbl_tipo_despacho b on (b.IDdespacho=a.TipEnt) where a.cdocu in ('01','03') AND a.flag<>'*' AND a.ndge='' AND a.codven_usu=@codven AND a.ndocu=@doc";
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
    consulta.addParameter('doc',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={factura_sugerencia_vendedor}
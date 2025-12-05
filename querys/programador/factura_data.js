require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programar_factura_data = (resolve,reject,conexion,body)=>{

    let factura= body.factura;

    let sq_sql="select TipEnt,cdocu,ndocu,nomcli,Codcdv,CodAlm,codven_usu,dirent,codtra,codtra2 from mst01fac where cdocu in ('01','03') and ndocu=@doc and flag='0'";
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
                resolve(respuesta2[0]);
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,factura);
    conexion.execSql(consulta);
}

module.exports={programar_factura_data}
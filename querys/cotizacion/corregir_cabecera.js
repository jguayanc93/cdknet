require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cabecera_corregido = (resolve,reject,conexion,montos)=>{

    let sq_sql="update mst01cot set tota=@totalisado,toti=@totaligv,totn=@totalconigv where ndocu=@doc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            resolve("cotizacion cabecera corregido");
        }
    })
    consulta.addParameter('totalisado',TYPES.VarChar,montos[1]);
    consulta.addParameter('totaligv',TYPES.VarChar,montos[2]);
    consulta.addParameter('totalconigv',TYPES.VarChar,montos[3]);
    consulta.addParameter('doc',TYPES.VarChar,montos[0]);
    conexion.execSql(consulta);
}

module.exports={cabecera_corregido}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cabecera_corregido = (resolve,reject,conexion,documento)=>{

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
    consulta.addParameter('totalisado',TYPES.VarChar,);
    consulta.addParameter('totaligv',TYPES.VarChar,);
    consulta.addParameter('totalconigv',TYPES.VarChar,);
    consulta.addParameter('doc',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={cabecera_corregido}
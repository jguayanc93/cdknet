require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let limpiar_detallado = (resolve,reject,conexion,documento)=>{

    let sq_sql="delete from dtl01cot where ndocu=@doc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            resolve("detallado limpiado");
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={limpiar_detallado}
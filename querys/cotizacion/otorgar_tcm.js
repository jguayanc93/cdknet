require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cotizacion_registrar_tcm = (resolve,reject,conexion,galleta,documento)=>{

    // let vendedor = galleta.codigo;

    // let sq_sql="update mst01cot set codven_usu=@codven where ndocu=@doc";
    let sq_sql="update mst01cot set tcme='3.37' where ndocu=@doc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            resolve("recursion completa");
        }
    })    
    // consulta.addParameter('codven',TYPES.VarChar,vendedor);
    consulta.addParameter('doc',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={cotizacion_registrar_tcm}
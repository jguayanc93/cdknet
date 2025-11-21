require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let correlativo_update = (resolve,reject,conexion,correlativo)=>{

    let sq_sql="update tbl01cor set nroini=@correlativo where cdocu='31' AND codpto='01'";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            resolve("actualisado con exito");
            
        }
    })
    consulta.addParameter('correlativo',TYPES.VarChar,correlativo);
    conexion.execSql(consulta);
}

module.exports={correlativo_update}
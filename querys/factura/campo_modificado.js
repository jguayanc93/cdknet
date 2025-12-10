require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let factura_campo_update = (resolve,reject,conexion,utilidades)=>{

    let sq_sql=utilidades[0];

    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve({"resultado":"actualisado"});
        }
    })
    consulta.addParameter('update',TYPES.VarChar,utilidades[1]);
    consulta.addParameter('doc',TYPES.VarChar,utilidades[2]);
    conexion.execSql(consulta);
}

module.exports={factura_campo_update}
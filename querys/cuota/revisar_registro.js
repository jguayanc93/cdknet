require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_existe = (resolve,reject,conexion,galleta)=>{

    let sq_sql="select * from tbl_api_vendedores_meta where anno=YEAR(GETDATE()) AND mes=MONTH(GETDATE()) AND codven=@codusu";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
                        
            if(rows.length==0){
                resolve("registro permitido");
            }
            else{
                reject("cuota existe");
            }
        }
    })
    consulta.addParameter('codusu',TYPES.VarChar,galleta.identificador);
    conexion.execSql(consulta);
}

module.exports={cuota_existe}
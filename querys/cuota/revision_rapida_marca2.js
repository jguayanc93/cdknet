require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let revision_rapida_marca_existe2 = (resolve,reject,conexion,galleta,body)=>{

    let codigo=body.codigo;

    // let sq_sql="select * from tbl01api_jefaturas_meta where anno=YEAR(GETDATE()) AND mes=MONTH(GETDATE()) AND codmar=@marc AND codusu=@codusu";
    let sq_sql="select * from tbl01api_jefaturas_meta where anno=YEAR(GETDATE()) AND mes=MONTH(GETDATE()) AND codmar=@codmar";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
                        
            if(rows.length==0){
                reject("tiene un registro marca");
            }
            else{
                resolve("puede registrar cuota de esta marca");
            }
        }
    })
    consulta.addParameter('codmar',TYPES.VarChar,codigo);
    conexion.execSql(consulta);
}

module.exports={revision_rapida_marca_existe2}
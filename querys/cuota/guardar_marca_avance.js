require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let guardar_marca_seleccionada_avance = (resolve,reject,conexion,body,avance)=>{

    let codmar=body.codigo;
    
    let sq_sql="update tbl01api_jefaturas_meta set avance=@ven,costo=@cost,rentabilidad=@rent where anno=YEAR(GETDATE()) AND mes=MONTH(GETDATE()) AND codmar=@codmar";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve("marca actualisada")
        }
    })
    consulta.addParameter('ven',TYPES.Float,avance[0]);
    consulta.addParameter('cost',TYPES.Float,avance[1]);
    consulta.addParameter('rent',TYPES.Float,avance[2]);
    consulta.addParameter('codmar',TYPES.VarChar,codmar);
    conexion.execSql(consulta);
}

module.exports={guardar_marca_seleccionada_avance}
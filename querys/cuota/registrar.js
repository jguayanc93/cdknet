require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let registro_cuota = (resolve,reject,conexion,galleta,diferenciador,body)=>{

    let cuota = body.fijado;

    let sq_sql="INSERT INTO tbl_api_vendedores_meta(codven,anno,mes,monto,volumen,cobertura,diferenciador) VALUES(@codusu,YEAR(GETDATE()),MONTH(GETDATE()),@cuota,50,50,@diferenciador)";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve("registro exitoso");
        }
    })
    consulta.addParameter('codusu',TYPES.VarChar,galleta.identificador);
    consulta.addParameter('cuota',TYPES.Float,cuota);
    consulta.addParameter('diferenciador',TYPES.VarChar,diferenciador);
    conexion.execSql(consulta);
}

module.exports={registro_cuota}
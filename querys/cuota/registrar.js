require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let registro_cuota = (resolve,reject,conexion,galleta,diferenciador,body,codfam)=>{

    let cuota = body.fijado;
    let porcentaje = body.porcentaje;
    let family = codfam;

    // let sq_sql="INSERT INTO tbl_api_vendedores_meta(codven,anno,mes,monto,volumen,cobertura,diferenciador) VALUES(@codusu,YEAR(GETDATE()),MONTH(GETDATE()),@cuota,50,50,@diferenciador)";
    let sq_sql="INSERT INTO tbl_api_vendedores_meta(codven,anno,mes,monto,volumen,cobertura,diferenciador,family,obj_espc) VALUES(@codusu,YEAR(GETDATE()),MONTH(GETDATE()),@cuota,50,50,@diferenciador,@family,@porcentaje)";
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
    consulta.addParameter('family',TYPES.VarChar,family);
    consulta.addParameter('porcentaje',TYPES.Float,porcentaje);
    conexion.execSql(consulta);
}

module.exports={registro_cuota}
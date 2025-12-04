require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let registro_cuota_marca = (resolve,reject,conexion,galleta,diferenciador,body)=>{

    let cuota = body.fijado;
    let codigo = body.codigo;
    let recortado = body.recortado;

    // let sq_sql="INSERT INTO tbl_api_vendedores_meta(codven,anno,mes,monto,volumen,cobertura,diferenciador) VALUES(@codusu,YEAR(GETDATE()),MONTH(GETDATE()),@cuota,50,50,@diferenciador)";
    let sq_sql="INSERT INTO tbl01api_jefaturas_meta(codmar,marc,anno,mes,dia,monto,costo,rentabilidad,unidades,codusu,nombre,avance) VALUES(@codmarc,@marc,YEAR(GETDATE()),MONTH(GETDATE()),DAY(GETDATE()),@cuota,0,0,0,@codusu,@usu,0)";
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
    consulta.addParameter('codmarc',TYPES.VarChar,codigo);
    consulta.addParameter('marc',TYPES.VarChar,recortado);
    consulta.addParameter('cuota',TYPES.Float,cuota);
    consulta.addParameter('codusu',TYPES.VarChar,galleta.identificador);
    consulta.addParameter('usu',TYPES.VarChar,galleta.nombre);
    conexion.execSql(consulta);
}

module.exports={registro_cuota_marca}
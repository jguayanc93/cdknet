require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let marcas_registro = (resolve,reject,conexion,galleta,diferenciador,body)=>{

    let mar_arr = body.marcas;
    for(const marc of mar_arr){ marc.pop()}
    let mar_obj = {};    

    Object.assign(mar_obj,mar_arr);

    let cadena_obj=JSON.stringify(mar_obj);

    let sq_sql="INSERT INTO tbl01api_vendedores_marcas(codusu,nombre,diferenciador,marcas) VALUES(@codusu,@nombre,@tipo,@marc)";
    
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve("marcas guardadas");
        }
    })
    consulta.addParameter('codusu',TYPES.VarChar,galleta.identificador);
    consulta.addParameter('nombre',TYPES.VarChar,galleta.nombre);
    consulta.addParameter('tipo',TYPES.VarChar,diferenciador);
    consulta.addParameter('marc',TYPES.VarChar,cadena_obj);
    conexion.execSql(consulta);
}

module.exports={marcas_registro}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let logeo_registro = (resolve,reject,payload,conexion,req)=>{

    let tipo = req.body.diferenciador;

    let sq_sql="INSERT INTO tbl_api_vendedores_diferenciador(codven,nombre,diferenciador,codgru,codusu) VALUES(@codven,@nombre,@tipo,@grupo,@id)";
    
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve(tipo);
        }
    })
    consulta.addParameter('codven',TYPES.VarChar,payload.codigo);
    consulta.addParameter('nombre',TYPES.VarChar,payload.nombre);
    consulta.addParameter('tipo',TYPES.VarChar,tipo);
    consulta.addParameter('grupo',TYPES.VarChar,payload.id_grupo);
    consulta.addParameter('id',TYPES.VarChar,payload.identificador);
    conexion.execSql(consulta);
}

module.exports={logeo_registro}
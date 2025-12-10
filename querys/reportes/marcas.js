require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let marcas_registradas = (resolve,reject,conexion,galleta)=>{

    let codusu=galleta.identificador;

    let sq_sql="select marcas from tbl01api_vendedores_marcas where codusu=@codusu";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("no registra marcas");
            }
            else{
                let respuesta=[];                
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });                

                resolve(respuesta[0][0]);
            }
        }
    })
    consulta.addParameter('codusu',TYPES.VarChar,codusu);
    conexion.execSql(consulta);
}

module.exports={marcas_registradas}
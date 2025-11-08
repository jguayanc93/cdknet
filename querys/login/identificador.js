require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let identificador_logeo = (resolve,reject,payload,conexion)=>{

    let sq_sql="select * from tbl_api_vendedores_diferenciador where codusu=@vendedor";
    // let sq_sql=process.env.LOGIN_IDENTIFICADOR;
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("no identificado");
            }
            else{
                /////////////caso contrario de estar registrado e identificado se le concedera todos sus modulos correspondientes
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

                resolve(respuesta[0]);
            }
        }
    })
    consulta.addParameter('vendedor',TYPES.VarChar,payload.identificador);
    // consulta.addParameter('passcuenta',TYPES.VarChar,pass);
    conexion.execSql(consulta);
}

module.exports={identificador_logeo}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_atencion = (resolve,reject,conexion,codcli)=>{

    let sq_sql="select top 1 Nomcon from dtl01con where Codn=@codcli and flagcontcompra=1";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("atencion no registrada");
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
    consulta.addParameter('codcli',TYPES.VarChar,codcli);
    conexion.execSql(consulta);
}

module.exports={coti_atencion}
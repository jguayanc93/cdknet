require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let tipo_cambio = (resolve,reject,conexion)=>{

    let sq_sql="select tcvta,fecha,DATEADD(DAY,10,fecha) from tbl01tca where CONVERT(char(10),fecha,111)=CONVERT(char(10),GETDATE(),111)";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("tipcambio no registrado");
            }
            else{
                let respuesta=[];
                // let respuesta2={};
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
                // Object.assign(respuesta2,respuesta);
                resolve(respuesta[0]);
            }
        }
    })
    // consulta.addParameter('pista',TYPES.VarChar,prdcodi);
    conexion.execSql(consulta);
}

module.exports={tipo_cambio}
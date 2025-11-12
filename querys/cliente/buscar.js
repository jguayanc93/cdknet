require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cliente_buscar = (resolve,reject,conexion,req,next)=>{

    let caracter=`%${req.body.sugerencia}%`;

    let sq_sql="select top 4 codcli,nomcli from mst01cli where estado=1 and nomcli like @pista";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("cliente no similitudes");
            }
            else{
                let respuesta=[];
                let respuesta2={};
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
                Object.assign(respuesta2,respuesta);
                resolve(respuesta2);
            }
        }
    })
    consulta.addParameter('pista',TYPES.VarChar,caracter);
    conexion.execSql(consulta);
}

module.exports={cliente_buscar}
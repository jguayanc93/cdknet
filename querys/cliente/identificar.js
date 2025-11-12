require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cliente_id = (resolve,reject,conexion,req,next)=>{

    let idcli=req.body.idcliente;

    let sq_sql="select codcli,nomcli,ruccli,codven,codcdv,tipocl from mst01cli where estado=1 and codcli=@ccli";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("cliente no registrado");
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
    consulta.addParameter('ccli',TYPES.VarChar,idcli);
    conexion.execSql(consulta);
}

module.exports={cliente_id}
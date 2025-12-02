require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let marca_buscar = (resolve,reject,conexion,req,next)=>{

    let caracter=`%${req.body.sugerencia}%`;
    
    let sp_sql="select codmar,Nommar,abrmar from tbl01mar where codmar NOT IN('0001','0002','0047','0123') AND Nommar like @pista";

    let consulta= new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("marca no registrada");
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

module.exports={marca_buscar}
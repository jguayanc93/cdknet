require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let prom_cabeza_seccion1 = (resolve,reject,conexion,body)=>{

    let nprom= body.codigoPromo;
    
    let sq_sql="select idprom,nomprom,desprom,porvta,tipdsct,tipdsctoto,metrica,undvtaprom,lpdsct,idagrupa,prioagrupa from mst_promocion where estado=1 and idprom=@nprom";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){ reject("promocion no existe"); }
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
                resolve(respuesta2[0]);
            }
        }
    })
    consulta.addParameter('nprom',TYPES.VarChar,nprom);
    conexion.execSql(consulta);
}

module.exports={prom_cabeza_seccion1}
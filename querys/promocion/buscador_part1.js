require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let promo_buscador_simple = (resolve,reject,conexion,respuesta2)=>{
    let codi_recolector=[];

    let items=respuesta2.productos;

    for(let codi in items){ codi_recolector.push(items[codi][codigo]); }
    
    let contador=1;
    // let sp_sql="select a.idprom,b.codi from mst_promocion a join dtl_promocion_progra b on b.idprom=a.idprom where a.estado=1 group by a.idprom,b.codi";
    let sp_sql="select a.idprom,b.codi from mst_promocion a join dtl_promocion_progra b on b.idprom=a.idprom where a.estado=1 AND b.codi in(";
    for(let codi of codi_recolector){
        
        if(contador>=codi_recolector.length){
            sp_sql+="'"+codi+"'"+') group by a.idprom,b.codi';
        }
        else{
            sp_sql+="'"+codi+"'"+',';
        }
        contador++;
    }

    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
            // res.status(401).send("error interno"); 
        }
        else{

            conexion.close();

            if(rows.length==0){
                reject("ninguna promocion")
                // res.status(401).send("no promo");
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
                resolve(respuesta);
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={promo_buscador_simple}
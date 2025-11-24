require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let promo_buscador = (resolve,reject,conexion,respuesta2)=>{
    let codi_recolector=[];

    for(let codi in respuesta2){ codi_recolector.push(respuesta2[codi][9]); }
    
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
                // console.log("OBSERVA LOS IDPROM SIN FILTRAR")
                // console.log(respuesta2);
                let nuevoobj={};
                let filtro_final=[];
                let nueva_programacion=respuesta.forEach((programacion)=>{
                    if(Object.hasOwn(nuevoobj,programacion[1])){
                        nuevoobj[programacion[1]]+="/"+programacion[0];
                    }
                    else{ nuevoobj[programacion[1]]=String(programacion[0])}
                })
                // console.log("OBSERVA LOS IDPROM FILTRADOS")
                // console.log(nuevoobj);
                Object.values(nuevoobj).forEach((valor)=>{
                    let separador=valor.split('/');
                    for(let idprom of separador){
                        if(filtro_final.includes(idprom)){}
                        else{
                            filtro_final.push(idprom)
                        }
                    }
                })
                // console.log(filtro_final);
                resolve(filtro_final)
                // res.status(200).json(filtro_final)
                
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={promo_buscador}
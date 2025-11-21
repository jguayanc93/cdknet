require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let num_correlativo = (resolve,reject,conexion)=>{

    let sq_sql="select top 1 RIGHT(ndocu,8) as nroactual from mst01cot where LEFT(ndocu,3)='009' order by RIGHT(ndocu,8) desc";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("correlativo inexistente");
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
                let comodin="009-00";
                let n_actual = parseInt(respuesta[0]);
                let n_calcular=n_actual+1;
                let formato=comodin+n_calcular.toString();

                resolve(formato);
            }
        }
    })
    // consulta.addParameter('pista',TYPES.VarChar,prdcodi);
    conexion.execSql(consulta);
}

module.exports={num_correlativo}
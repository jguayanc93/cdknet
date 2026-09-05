require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let num_correlativo = (resolve,reject,conexion)=>{

    // let sq_sql="select top 1 RIGHT(ndocu,8) as nroactual from mst01cot where LEFT(ndocu,3)='098' order by RIGHT(ndocu,8) desc";
    let sq_sql="select '00000000'";
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
                let comodin="098-";
                let n_actual = parseInt(respuesta[0][0]);
                let n_calcular=n_actual+1;
                ///aqui falta rellenar con ceros a la izquierda para que siempre tenga 8 digitos
                let formato="";
                if(n_calcular.toString().length<8){
                    let diferencia=8-n_calcular.toString().length;///aca cuenta cuantos ceros le faltan para completar los 8 digitos
                    let ceros="0".repeat(diferencia);///aca rellena con ceros a la izquierda
                    formato=comodin+ceros+n_calcular.toString();
                }
                else{
                    formato=comodin+n_calcular.toString();
                }

                resolve(formato);
            }
        }
    })
    // consulta.addParameter('pista',TYPES.VarChar,prdcodi);
    conexion.execSql(consulta);
}

module.exports={num_correlativo}
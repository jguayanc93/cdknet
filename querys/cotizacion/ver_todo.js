require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_vertodo = (resolve,reject,conexion,cuerpo)=>{

    let numero= cuerpo.ncoti;
    let ncoti="009-00"+numero;

    let sq_sql="select a.codf,a.marc,a.descr,a.cant,a.preu,a.totn,a.dsct,a.codalm from dtl01cot a inner join mst01cot b on (b.ndocu=a.ndocu) where b.flag=0 AND a.ndocu=@coti order by item";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("cotizacion no registrada");
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
    consulta.addParameter('coti',TYPES.VarChar,ncoti);
    conexion.execSql(consulta);
}

module.exports={coti_vertodo}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let reporte_tiempo = (resolve,reject,conexion,body)=>{

    let marca=body.marca;

    let sq_sql="select b.codf,b.descr,a.nomfam,b.Usr_001,ISNULL(dbo.API_TIEMPO_PRODUCTO(b.codi),0) from tbl01fam a inner join prd0101 b on (LEFT(b.codi,2)=a.codfam) left join prd0108 c on (c.codi=b.codi) where b.estado=1 AND b.marc=@marca";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("no registra tiempo");
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

                resolve(respuesta);
            }
        }
    })
    consulta.addParameter('marca',TYPES.VarChar,marca);
    conexion.execSql(consulta);
}

module.exports={reporte_tiempo}
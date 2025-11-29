require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_vertodo = (resolve,reject,conexion,cuerpo)=>{

    let numero= cuerpo.ncoti;
    let ncoti="009-00"+numero;

    // let sq_sql="select a.codf,a.marc,a.descr,a.cant,a.preu,a.totn,a.dsct,a.codalm from dtl01cot a inner join mst01cot b on (b.ndocu=a.ndocu) where b.flag=0 AND a.ndocu=@coti order by item";
    let sq_sql="select b.tipocl,a.fecha,a.cdocu,a.ndocu,a.codcli,a.tcam,a.mone,a.moneitm,a.aigv,a.item,a.codi,a.codf,a.marc,a.umed,a.descr,a.cant,a.preu,a.tota,a.dsct,a.totn,a.codalm,a.cost,a.msto from dtl01cot a inner join mst01cli b on (b.codcli=a.codcli) inner join mst01cot c on (c.ndocu=a.ndocu) where a.ndocu=@coti AND c.flag='0' AND c.estado='0' AND c.mone='D' AND (a.codi='0303-010001' OR LEFT(a.descr,11)='GRATIS/PROM') AND LEFT(descr,27)<>'DSCTO/PROM: FLETE PROVINCIA' order by a.item";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("promocion no tiene");
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
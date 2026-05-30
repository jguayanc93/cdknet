require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let ver_flete = (resolve,reject,conexion,data,body)=>{

    let numero= body.npedi;
    //'009-00764293'
    
    // let sq_sql="select b.tipocl,a.fecha,a.cdocu,a.ndocu,a.codcli,a.tcam,a.mone,a.moneitm,a.aigv,'item',a.codi,a.codf,a.marc,a.umed,a.descr,a.cant,a.preu,a.tota,a.dsct,a.totn,a.codalm,a.cost,a.msto from dtl01cot a inner join mst01cli b on (b.codcli=a.codcli) inner join mst01cot c on (c.ndocu=a.ndocu) where a.ndocu=@coti AND c.flag='0' order by a.item";
    let sq_sql="select b.flag,b.apro,DATEDIFF(DAY,a.fecha,GETDATE()),a.ndocu,a.codcli,a.item,a.codf,a.descr,a.marc,a.cant,a.dsct,a.preu,a.totn,a.mone from dtl01ped a inner join mst01ped b on (b.ndocu=a.ndocu) where b.ndocu=@numero AND b.codven_usu=@vendedor order by a.item";
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
    consulta.addParameter('numero',TYPES.VarChar,numero);
    consulta.addParameter('vendedor',TYPES.VarChar,data.codigo);
    conexion.execSql(consulta);
}

module.exports={ver_flete}
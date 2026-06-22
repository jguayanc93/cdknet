require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let promo_vertodo = (resolve,reject,conexion,cuerpo)=>{

    let numero= cuerpo.ncoti;
    let ncoti="009-00"+numero;

    let sq_sql="select CONVERT(varchar,fecha,120) as fecha,cdocu,ndocu,codcli,tcam,mone,moneitm,aigv,item,codi,codf,marc,umed,descr,cant,preu,tota,dsct,totn,codalm,cost,msto,ucon,ucom,obse from dtl01cot where ndocu=@coti order by item";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
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

module.exports={promo_vertodo}
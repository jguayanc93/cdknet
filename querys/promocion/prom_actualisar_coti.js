require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_update_montos_promo_removidos = (resolve,reject,conexion,documento)=>{

    // let sq_sql="update mst01cot set tota=@tota,toti=@toti,totn=@totn where ndocu=@ncoti and flag=0 and estado=0";
    let sq_sql="update mst01cot set tota=(select SUM(tota) from dtl01cot where ndocu=@ncoti),totn=(select SUM(totn) from dtl01cot where ndocu=@ncoti) where ndocu=@ncoti and flag=0 and estado=0";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve("corregido");
        }
    })
    // consulta.addParameter('tota',TYPES.VarChar,fullpromo["descuento"][1].toFixed(2));
    // consulta.addParameter('toti',TYPES.VarChar,fullpromo["descuento"][2].toFixed(2));
    // consulta.addParameter('totn',TYPES.VarChar,fullpromo["descuento"][3].toFixed(2));
    consulta.addParameter('ncoti',TYPES.VarChar,documento);
    conexion.execSql(consulta);
}

module.exports={coti_update_montos_promo_removidos}
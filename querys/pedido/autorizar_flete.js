require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let activar_flete = (resolve,reject,conexion,data,body)=>{

    let numero= body.npedi;
    //'009-00764293'
    
    // let sq_sql="select b.tipocl,a.fecha,a.cdocu,a.ndocu,a.codcli,a.tcam,a.mone,a.moneitm,a.aigv,'item',a.codi,a.codf,a.marc,a.umed,a.descr,a.cant,a.preu,a.tota,a.dsct,a.totn,a.codalm,a.cost,a.msto from dtl01cot a inner join mst01cli b on (b.codcli=a.codcli) inner join mst01cot c on (c.ndocu=a.ndocu) where a.ndocu=@coti AND c.flag='0' order by a.item";
    let sq_sql="jc_activar_flete_externo";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            resolve("flete aplicado correctamente");
        }
    })
    consulta.addParameter('numero',TYPES.VarChar,numero);
    conexion.callProcedure(consulta);
}

module.exports={activar_flete}
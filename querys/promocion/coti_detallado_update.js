require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let detallado_bucle = (resolve,reject,conexion,fullpromo)=>{
    let contador=0;
    let orden=Object.keys(fullpromo);
    
    minibucle(resolve,reject,conexion,fullpromo,orden,contador);
}

let minibucle =(resolve,reject,conexion,fullpromo,longitud,contador)=>{

    if(longitud.length<=contador){
        conexion.close();
        resolve("anidamiento exitoso");
    }
    else{
        console.log("debo aparecer 2 veces minimo");
        let sq_sql="GrabaDTLCotFacWeb";
        let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error query");
            }
            else{
                minibucle(resolve,reject,conexion,fullpromo,longitud,contador+1);
            }
        })
        consulta.addParameter('cdocu',TYPES.Char,fullpromo[longitud[contador]][1]);
        consulta.addParameter('ndocu',TYPES.Char,fullpromo[longitud[contador]][2]);
        consulta.addParameter('codcli',TYPES.Char,fullpromo[longitud[contador]][3]);
        consulta.addParameter('tcam',TYPES.Float,fullpromo[longitud[contador]][4]);
        consulta.addParameter('mone',TYPES.Char,fullpromo[longitud[contador]][8]);
        consulta.addParameter('moneitm',TYPES.Char,fullpromo[longitud[contador]][9]);
        consulta.addParameter('aigv',TYPES.Char,fullpromo[longitud[contador]][10]);///falta aigv
        consulta.addParameter('item',TYPES.Float,fullpromo[longitud[contador]][6]);
        consulta.addParameter('codi',TYPES.Char,fullpromo[longitud[contador]][11]);
        consulta.addParameter('codf',TYPES.Char,fullpromo[longitud[contador]][12]);
        consulta.addParameter('marc',TYPES.Char,fullpromo[longitud[contador]][13]);
        consulta.addParameter('umed',TYPES.Char,fullpromo[longitud[contador]][14]);
        consulta.addParameter('descr',TYPES.Char,fullpromo[longitud[contador]][15]);
        consulta.addParameter('cant',TYPES.Float,fullpromo[longitud[contador]][7]);
        consulta.addParameter('preu',TYPES.Float,fullpromo[longitud[contador]][16]);
        consulta.addParameter('tota',TYPES.Float,fullpromo[longitud[contador]][17]);
        consulta.addParameter('dsct',TYPES.Float,fullpromo[longitud[contador]][18]);
        consulta.addParameter('totn',TYPES.Float,fullpromo[longitud[contador]][19]);
        consulta.addParameter('AnulaDetalle',TYPES.Char,'');
        consulta.addParameter('codalm',TYPES.Char,fullpromo[longitud[contador]][20]);
        consulta.addParameter('cost',TYPES.Float,fullpromo[longitud[contador]][21]);
        consulta.addParameter('msto',TYPES.Char,fullpromo[longitud[contador]][22]);
        consulta.addParameter('ucon',TYPES.Float,fullpromo[longitud[contador]][23]);
        consulta.addParameter('ucom',TYPES.Char,fullpromo[longitud[contador]][24]);
        consulta.addParameter('obse',TYPES.VarChar,fullpromo[longitud[contador]][25]);
        conexion.callProcedure(consulta);
    }
}

module.exports={detallado_bucle}
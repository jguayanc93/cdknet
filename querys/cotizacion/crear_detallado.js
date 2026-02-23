require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_detallado = (resolve,reject,conexion,info_cliente,objtotal,fecha,formato)=>{
    let contador=0;
    let orden=[];
    for(let indice in objtotal){ orden.push(indice); }
    detallado_bucle(resolve,reject,conexion,info_cliente,objtotal,fecha[0],formato,Object.keys(objtotal).length,orden,contador);
}

let detallado_bucle =(resolve,reject,conexion,dataenviada,objtotal,fecha,formato,longuitud,orden,contador)=>{

    if(longuitud<=contador){
        conexion.close();
        resolve("recursion completa");
    }
    else{
        let sq_sql="GrabaDTLCotFacWeb";
        let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error query");
            }
            else{
                detallado_bucle(resolve,reject,conexion,dataenviada,objtotal,fecha,formato,longuitud,orden,contador+1);
            }
        })
        consulta.addParameter('cdocu',TYPES.Char,'31');
        consulta.addParameter('ndocu',TYPES.Char,formato);
        consulta.addParameter('codcli',TYPES.Char,dataenviada["cliente"][0]);
        consulta.addParameter('tcam',TYPES.Float,fecha);
        consulta.addParameter('mone',TYPES.Char,dataenviada["moneda"]);
        consulta.addParameter('moneitm',TYPES.Char,'D');
        consulta.addParameter('aigv',TYPES.Char,'S');
        consulta.addParameter('item',TYPES.Float,contador+1);
        consulta.addParameter('codi',TYPES.Char,orden[contador]);
        consulta.addParameter('codf',TYPES.Char,objtotal[orden[contador]][0]);
        consulta.addParameter('marc',TYPES.Char,objtotal[orden[contador]][1]);
        consulta.addParameter('umed',TYPES.Char,'UND');
        consulta.addParameter('descr',TYPES.Char,objtotal[orden[contador]][2]);
        consulta.addParameter('cant',TYPES.Float,objtotal[orden[contador]][3]);
        consulta.addParameter('preu',TYPES.Float,objtotal[orden[contador]][4]);
        consulta.addParameter('tota',TYPES.Float,objtotal[orden[contador]][5]);
        consulta.addParameter('dsct',TYPES.Float,objtotal[orden[contador]][6]);
        consulta.addParameter('totn',TYPES.Float,objtotal[orden[contador]][7]);
        consulta.addParameter('AnulaDetalle',TYPES.Char,'');
        consulta.addParameter('codalm',TYPES.Char,'01');
        consulta.addParameter('cost',TYPES.Float,objtotal[orden[contador]][8]);
        consulta.addParameter('msto',TYPES.Char,'S');
        consulta.addParameter('ucon',TYPES.Float,1.000);
        consulta.addParameter('ucom',TYPES.Char,'UND');
        consulta.addParameter('obse',TYPES.VarChar,'');
        conexion.callProcedure(consulta);
    }
}

module.exports={coti_detallado}
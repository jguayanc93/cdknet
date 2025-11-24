require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let detallado_corregido = (resolve,reject,conexion,dataenviada)=>{
    let contador=0;
    let orden=[];
    for(let indice in dataenviada){ orden.push(dataenviada[indice]); }
    minibucle(resolve,reject,conexion,dataenviada,contador,orden);
}

let minibucle=(resolve,reject,conexion,dataenviada,contador,orden)=>{
    if(Object.keys(dataenviada).length<=contador){
        conexion.close();
        resolve("recursion completa");
    }
    else{
        let sp_sql="GrabaDTLCotFac";
        let consulta=new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject("error query");
            }
            else{
                minibucle(resolve,reject,conexion,dataenviada,contador+1,orden);
            }
        })
        consulta.addParameter('fecha',TYPES.DateTime,orden[contador][0]);
        consulta.addParameter('cdocu',TYPES.Char,orden[contador][1]);
        consulta.addParameter('ndocu',TYPES.Char,orden[contador][2]);
        consulta.addParameter('codcli',TYPES.Char,orden[contador][3]);
        consulta.addParameter('tcam',TYPES.Float,orden[contador][4]);
        consulta.addParameter('mone',TYPES.Char,orden[contador][5]);
        consulta.addParameter('moneitm',TYPES.Char,orden[contador][6]);
        consulta.addParameter('aigv',TYPES.Char,orden[contador][7]);
        consulta.addParameter('item',TYPES.Float,orden[contador][8]);
        consulta.addParameter('codi',TYPES.Char,orden[contador][9]);
        consulta.addParameter('codf',TYPES.Char,orden[contador][10]);
        consulta.addParameter('marc',TYPES.Char,orden[contador][11]);
        consulta.addParameter('umed',TYPES.Char,orden[contador][12]);
        consulta.addParameter('descr',TYPES.Char,orden[contador][13]);
        consulta.addParameter('cant',TYPES.Float,orden[contador][14]);
        consulta.addParameter('preu',TYPES.Float,orden[contador][15]);
        consulta.addParameter('tota',TYPES.Float,orden[contador][16]);
        consulta.addParameter('dsct',TYPES.Float,orden[contador][17]);
        consulta.addParameter('totn',TYPES.Float,orden[contador][18]);
        consulta.addParameter('AnulaDetalle',TYPES.Char,'');
        consulta.addParameter('codalm',TYPES.Char,orden[contador][19]);
        // consulta2.addParameter('codalm',TYPES.Char,'01');
        consulta.addParameter('cost',TYPES.Float,orden[contador][20]);
        consulta.addParameter('msto',TYPES.Char,orden[contador][21]);
        conexion.callProcedure(consulta);
    }    
}

module.exports={detallado_corregido}
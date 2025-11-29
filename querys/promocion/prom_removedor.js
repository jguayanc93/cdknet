require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let removido_items_bucle = (resolve,reject,conexion,body)=>{
    let contador=0;
    let orden=body.removeproms.length;
    
    removebucle(resolve,reject,conexion,body.removeproms,orden,contador);
}

let removebucle =(resolve,reject,conexion,removeproms,longitud,contador)=>{

    if(removeproms.length<=contador){
        conexion.close();
        resolve("desacoplamiento exitoso");
    }
    else{
        let sq_sql="delete from dtl01cot where ndocu=@doc AND item=@fila";
        let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
            if(err){
                console.log(err)
                conexion.close();
                reject("error query");
            }
            else{
                removebucle(resolve,reject,conexion,removeproms,longitud,contador+1);
            }
        })
        consulta.addParameter('doc',TYPES.Char,removeproms[contador][0]);
        consulta.addParameter('fila',TYPES.Int,removeproms[contador][1]);
        conexion.execSql(consulta);
    }
}

module.exports={removido_items_bucle}
require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let cuota_marca_seleccionada_avance = (resolve,reject,conexion,galleta,body)=>{

    let marc=body.recortado;
    
    let sq_sql="select ISNULL(SUM(case a.mone when 'D' then a.tota else a.tota/a.tcam end),0),ISNULL(SUM(case a.mone when 'D' then (case a.cdocu when '01' then a.cost*a.cant when '03' then a.cost*a.cant when '07' then a.cost*a.cant*-1 end) when 'S' then (case a.cdocu when '01' then (a.cost/a.tcam)*a.cant when '03' then (a.cost/a.tcam)*a.cant when '07' then ((a.cost/a.tcam)*a.cant)*-1 end) end),0),ISNULL(SUM(case a.mone when 'D' then a.tota else a.tota/a.tcam end)-SUM(case a.mone when 'D' then (case a.cdocu when '01' then a.cost*a.cant when '03' then a.cost*a.cant when '07' then a.cost*a.cant*-1 end) when 'S' then (case a.cdocu when '01' then (a.cost/a.tcam)*a.cant when '03' then (a.cost/a.tcam)*a.cant when '07' then ((a.cost/a.tcam)*a.cant)*-1 end) end),0) from dtl01fac a inner join mst01fac b on (b.ndocu=a.ndocu) where b.flag<>'*' AND b.codvta<>'04' AND YEAR(b.fecha)=YEAR(GETDATE()) AND MONTH(b.fecha)=MONTH(GETDATE()) AND a.marc=@codmar";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                reject("cuota no existe");
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
                
                resolve(respuesta[0]);
            }
        }
    })
    consulta.addParameter('codmar',TYPES.VarChar,marc);
    conexion.execSql(consulta);
}

module.exports={cuota_marca_seleccionada_avance}
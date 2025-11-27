require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let coti_montos = (resolve,reject,conexion,fullpromo)=>{

    let ncoti= fullpromo["descuento"][0];

    let sq_sql="select tota,toti,totn from mst01cot where ndocu=@ncoti";
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
                fullpromo["descuento"][1]=respuesta2[0][0]+fullpromo["descuento"][1];
                fullpromo["descuento"][2]=respuesta2[0][1]+fullpromo["descuento"][2];
                fullpromo["descuento"][3]=respuesta2[0][2]+fullpromo["descuento"][3];
                resolve(fullpromo);
            }
        }
    })
    consulta.addParameter('ncoti',TYPES.VarChar,ncoti);
    conexion.execSql(consulta);
}

module.exports={coti_montos}
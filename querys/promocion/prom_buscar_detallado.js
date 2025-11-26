require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let prom_buscar_detallado = (resolve,reject,conexion,cuerpo)=>{

    let nprom= cuerpo.nprom;

    let sq_sql="select a.codi,a.monto,a.dsct,a.boncodf,a.stoclim,b.marc,a.idprom,b.pcus from dtl_promocion_progra a join prd0101 b on a.codi=b.codi where idprom=@nprom";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            ////////lo mandara aqui porqe aunque si exista no esta registrado en la intranet y debe registrarse
            if(rows.length==0){
                reject("promo no activada");
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
    consulta.addParameter('nprom',TYPES.VarChar,nprom);
    conexion.execSql(consulta);
}

module.exports={prom_buscar_detallado}
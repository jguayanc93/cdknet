require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let comprobacion_logeo = (resolve,reject,conexion,req,next)=>{
    let usu=req.body.cuenta;
    let pass=req.body.pass;
    let sq_sql="jc_user_identificador";
    // let sq_sql=process.env.LOGIN_IDENTIFICADOR;
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();

            if(rows.length==0){
                reject("no cdk user");
            }
            else{
                let respuesta=[];
                // let respuesta2={};
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

                resolve(respuesta[0])
                ////////esto no puede ir aqui en la consulta sino en otra funcion
                // Object.assign(respuesta2,respuesta);
                // respuesta2.permisos=jwtgenerator(respuesta2);
                // let cadenitajson=JSON.stringify(respuesta2.permisos);
                // res.cookie('cdk',respuesta2.permisos,{
                //     domain:'compudiskett.com.pe',
                //     path:'/',
                //     httpOnly:true,
                //     secure:true,
                //     sameSite:'None',
                //     signed:true
                // })
            }
        }
    })
    consulta.addParameter('usercuenta',TYPES.VarChar,usu);
    consulta.addParameter('passcuenta',TYPES.VarChar,pass);
    conexion.callProcedure(consulta);
}

module.exports={comprobacion_logeo}
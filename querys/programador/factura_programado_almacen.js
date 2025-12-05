require('dotenv').config();
const {Request,TYPES} = require('../../conexion/cadena')

let programar_factura_almacen = (resolve,reject,conexion,factura_data,zonas)=>{

    /////sacar zonas
    let z1=0
    let z2=0
    let z3=0
    let desconocido=0
    for (const zona of zonas) {
        if(zona=='desconocido'){desconocido++}
        else if(zona=='Z1'){z1++}
        else if(zona=='Z2'){z2++}
        else if(zona=='Z3'){z3++}
    }

    ///fechas obtenidas
    let hoy=new Date();
    let hora=hoy.getHours().toString();
    let minutos=hoy.getMinutes().toString();

    let sq_sql="jc_programar_documento_tablas";
    let consulta= new Request(sq_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject("error query");
        }
        else{
            conexion.close();
            
            if(rows.length==0){
                resolve("programado almacen");
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,factura_data[2]);
    consulta.addParameter('hora',TYPES.VarChar,hora);
    consulta.addParameter('estado',TYPES.VarChar,'0');
    consulta.addParameter('cliente',TYPES.VarChar,factura_data[4]);
    consulta.addParameter('despacho',TYPES.Int,factura_data[0]);
    consulta.addParameter('ejecutivo',TYPES.VarChar,factura_data[7]);
    consulta.addParameter('minutos',TYPES.VarChar,minutos);
    consulta.addParameter('reprogramado',TYPES.VarChar,'N');
    consulta.addParameter('piking',TYPES.Int,0);
    consulta.addParameter('cheking',TYPES.Int,0);
    consulta.addParameter('cantzone',TYPES.Int,zonas.length);
    consulta.addParameter('destino',TYPES.VarChar,factura_data[9]);
    consulta.addParameter('almacen',TYPES.VarChar,factura_data[6]);
    consulta.addParameter('nom_ejecutivo',TYPES.VarChar,factura_data[8]);
    consulta.addParameter('cod_cli',TYPES.VarChar,factura_data[3]);
    consulta.addParameter('codtra',TYPES.VarChar,factura_data[10]);
    consulta.addParameter('nomtra',TYPES.VarChar,factura_data[11]);
    consulta.addParameter('nomdep',TYPES.VarChar,factura_data[12]);
    consulta.addParameter('nompro',TYPES.VarChar,factura_data[13]);
    consulta.addParameter('zonas',TYPES.VarChar,zonas.toString());
    consulta.addParameter('zone1',TYPES.Int,z1);
    consulta.addParameter('zone2',TYPES.Int,z2);
    consulta.addParameter('zone3',TYPES.Int,z3);
    consulta.addParameter('desconocido',TYPES.Int,desconocido);
    conexion.callProcedure(consulta);
}

module.exports={programar_factura_almacen}
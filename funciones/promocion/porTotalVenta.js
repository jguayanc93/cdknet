
/// codigos,cotdetalle,tipopromo,promcabesa,promdetalle
let descuento_correspondiente=(codigos,cotdetalle,tipopromo,promcabesa,promdetalle)=>{
    ////FALTA COMENSAR POR COMO SEPARAR LA LOGICA POR SEGMENTOS
    let numero_item=1;
    numero_item=Object.keys(cotdetalle).length;
    let cantidad_correspondiente_obtenida;
    
    if(tipopromo["metrica"]==1){
        // cantidad_correspondiente_obtenida=m_valorizado_conjunto(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item);
        cantidad_correspondiente_obtenida=vx_valorizados(codigos,cotdetalle,tipopromo,promcabesa,promdetalle);
    }else{
        // cantidad_correspondiente_obtenida=m_unidades_conjunto(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item);
        cantidad_correspondiente_obtenida=vx_unidades(codigos,cotdetalle,tipopromo,promcabesa,promdetalle);
    }
    return cantidad_correspondiente_obtenida;
}
function vx_valorizados(codigos,cotdetalle,tipopromo,promcabesa,promdetalle){
    let items_correspondientes={};
    let check_monto_prom=0;
    /////solo queremos saber cuando se cumple la promo y que items son los que cumplen la promo
    for(let y in promdetalle){
        if(codigos.includes(promdetalle[y][0])){
            check_monto_prom=promdetalle[y][1];////MONTO MINIMO CUIDADO PUEDE SER UND/MONTO EJE 306.8
            let check_monto_item=cotdetalle[promdetalle[y][0]]["cantidad"];///MONTO QUE TIENE EL ITEM EN EL DETALLE
            let check_monto_precio=cotdetalle[promdetalle[y][0]]["PrecioUnitario"];///MONTO QUE TIENE EL ITEM EN EL DETALLE
            items_correspondientes[promdetalle[y][0]]=[check_monto_item,check_monto_precio];
        }
    }
    ////una ves recojido los items que coinciden en el grupo de la promo
    ///falta comparar las cantidad si es valido o invalido pa recibir la promo
    let cantidad_momentanea=0
    for(let x in items_correspondientes){
        cantidad_momentanea=cantidad_momentanea+items_correspondientes[x][1];///aqui cambia porqe es valorizado
    }
    if(Number(check_monto_prom)<=Number(cantidad_momentanea)){
        ////como si alcansa ahora veremos cuanto debe otorgarle en cantidad y descuento
        ///como es valorizado la logica cambia en la tabla es al reves los campos
        let unidades_minimas=promdetalle[0][1];///tanto monto necesita
        let cantidad_descuento=promdetalle[0][2];///cuantos debe darle
        let division=Math.floor(Number(cantidad_momentanea)/Number(check_monto_prom));
        ///ESTO PUEDE QUE ESTE DEMAS EN CUANTO A UN REGALO
        // let corresponde=division*(Number(unidades_minimas)*Number(cantidad_descuento))
        return [division,promdetalle[0][3]];
    }
    else{
        return "NO SUFICIENTE MONTO TOTALVENTA";
    }
}
function vx_unidades(codigos,cotdetalle,tipopromo,promcabesa,promdetalle){
    let items_correspondientes={};
    let check_monto_prom=0;
    /////solo queremos saber cuando se cumple la promo y que items son los que cumplen la promo
    for(let y in promdetalle){
        if(codigos.includes(promdetalle[y][0])){
            check_monto_prom=promdetalle[y][1];////MONTO MINIMO DE PROMOCION
            let check_monto_item=cotdetalle[promdetalle[y][0]]["cantidad"];///MONTO QUE TIENE EL ITEM EN EL DETALLE
            let check_monto_precio=cotdetalle[promdetalle[y][0]]["PrecioUnitario"];///MONTO QUE TIENE EL ITEM EN EL DETALLE
            items_correspondientes[promdetalle[y][0]]=[check_monto_item,check_monto_precio];
        }
    }
    ////una ves recojido los items que coinciden en el grupo de la promo
    ///falta comparar las cantidad si es valido o invalido pa recibir la promo
    let cantidad_momentanea=0
    for(let x in items_correspondientes){
        cantidad_momentanea=cantidad_momentanea+items_correspondientes[x][0];
    }
    if(Number(check_monto_prom)<=Number(cantidad_momentanea)){
        ////como si alcansa ahora veremos cuanto debe otorgarle en cantidad y descuento
        let unidades_minimas=promdetalle[0][1];
        let cantidad_descuento=promdetalle[0][2];
        let division=Math.floor(Number(check_monto_prom)/Number(cantidad_momentanea));
        let corresponde=division*(Number(unidades_minimas)*Number(cantidad_descuento))
        return [division,corresponde];
    }
    else{
        return "NO SUFICIENTE UNIDADES TOTALVENTA";
    }
}

////////PARA UNIFICAR EN UNA SOLA FUNCION LA SEPARACION DE UNIDADES Y CONJUNTO
function recorrido_conjunto_unidades_valorizados(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item){
    ///////////SOLO PARA LOS TOTALISADOS DE LA CABESERA
    let numero_documento;
    let cabesatota=0;
    let cabesatotn=0;
    ////////////////////////////PARA ACUMULAR LOS ITEMS
    let n_item=numero_item+1;
    let items_validos=[];
    let items_validos2={};
    let items_promos2=[];
    for(let x in cotdetalle){
        ///capturando todos los montos del detallado
        numero_documento=cotdetalle[x][2]////numero de cotizacion
        cabesatota+=parseFloat(cotdetalle[x][16]);///totalisado sin igv
        cabesatotn+=parseFloat(cotdetalle[x][18]);///totalisado con igv
        for(let y in promdetalle){
            ////falta el metodo para mandarlo a conjunto esto solo funciona por unitario
            if(promdetalle[y][0]==cotdetalle[x][9]){///////HASTA AQUI SON IGUALES LUEGO TIENES QUE SEPARARLOS

                let check_monto_prom=promdetalle[y][1];////MONTO MINIMO DE PROMOCION
                let check_monto_item=cotdetalle[x][14];///MONTO QUE TIENE LA COTIZACION
                let diferenciar_bonificacion=cotdetalle[x][13].substring(0,11);

                if(diferenciar_bonificacion!="GRATIS/PROM"){////A PARTIR DE AQUI COMIENSA LA DIFERENCIA

                    /////tipometrica=1 valorizado ---- tipometrica2 unidades -- ambos son de conjunto
                    if(tipometrica===1){
                        items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                        items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][9],cotdetalle[x][18]]);
                        items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                    }
                    else if(tipometrica===2){
                        if(check_monto_item>=check_monto_prom){

                            items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                            items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][13],cotdetalle[x][14]]);
            //////variable construida para separar q descuento le toca en especifico con el item identicado en el detallado de la prom
                            items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                        }
                    }
                }

            }
        }
    }

    ////trabajando con el resultado
    let retorno_conjunto;
    if(items_validos.length===0) return items_validos;
    else{
        ////AQUI DE NUEVO DIFERENCIAMOS EL ENVIO A SUS RESPECTIVAS SUMAS Y CALCULOS DE RESULTADOS
        if(tipometrica===1){
            retorno_conjunto=suma_cantidades(items_validos,items_promos2,n_item,promcabesa);
            return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
        }
        else{
            retorno_conjunto=suma_cantidades2(items_validos,items_promos2,n_item);
            return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
        }
    }
}
function recorrido_conjunto_unidades_valorizados2(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item){
    ///////////SOLO PARA LOS TOTALISADOS DE LA CABESERA
    let numero_documento;
    let cabesatota=0;
    let cabesatotn=0;
    ////////////////////////////PARA ACUMULAR LOS ITEMS
    let n_item=numero_item+1;
    let items_validos=[];
    let items_validos2={};
    let items_promos2=[];
    ///////////solo temporal para acumular los codis
    let codis_para_revisar=[];
    let cantidad=50;
    let cantidad_sumatoria=0;
    let identificar_codi_promocion={};///esta variable es para reemplazar a items_promos2
    for(let x in promdetalle){
        codis_para_revisar.push(promdetalle[x][0]);
        cantidad=promdetalle[x][1];
        identificar_codi_promocion[promdetalle[x][0]]=[promdetalle[x][0],promdetalle[x][1],promdetalle[x][2],promdetalle[x][3],promdetalle[x][4],promdetalle[x][5],promdetalle[x][6],promdetalle[x][7]];
    }
    for(let x in cotdetalle){
        if(codis_para_revisar.includes(cotdetalle[x][9])){
            cantidad_sumatoria=cantidad_sumatoria+cotdetalle[x][14];
        }
    }

    for(let x in cotdetalle){
        ///capturando todos los montos del detallado
        numero_documento=cotdetalle[x][2]////numero de cotizacion
        cabesatota+=parseFloat(cotdetalle[x][16]);///totalisado sin igv
        cabesatotn+=parseFloat(cotdetalle[x][18]);///totalisado con igv

        if(codis_para_revisar.includes(cotdetalle[x][9])){
            let check_monto_prom=cantidad;////MONTO MINIMO DE PROMOCION
            let check_monto_item=cantidad_sumatoria;///MONTO QUE TIENE LA COTIZACION
            let diferenciar_bonificacion=cotdetalle[x][13].substring(0,11);
            if(diferenciar_bonificacion!="GRATIS/PROM"){////A PARTIR DE AQUI COMIENSA LA DIFERENCIA
                /////tipometrica=1 valorizado ---- tipometrica2 unidades -- ambos son de conjunto
                if(tipometrica===1){
                    items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                    items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][9],cotdetalle[x][18]]);
                    items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                }
                else if(tipometrica===2){
                    if(check_monto_item>=check_monto_prom){
                        // items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                        items_validos2[cotdetalle[x][9]]=identificar_codi_promocion[cotdetalle[x][9]];
                        items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][13],cotdetalle[x][14]]);
                        //////variable construida para separar q descuento le toca en especifico con el item identicado en el detallado de la prom
                        // items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                        items_promos2.push(identificar_codi_promocion[cotdetalle[x][9]]);
                    }
                }
            }
        }
    }

    ////trabajando con el resultado
    let retorno_conjunto;
    if(items_validos.length===0) return items_validos;
    else{
        ////AQUI DE NUEVO DIFERENCIAMOS EL ENVIO A SUS RESPECTIVAS SUMAS Y CALCULOS DE RESULTADOS
        if(tipometrica===1){
            retorno_conjunto=suma_cantidades(items_validos,items_promos2,n_item,promcabesa);
            return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
        }
        else{
            retorno_conjunto=suma_cantidades2(items_validos,items_promos2,n_item);
            // console.log("retorno conjunto",retorno_conjunto)
            return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
        }
    }
}


///////PARA VALORIZADOS EN CONJUNTO
function m_valorizado_conjunto(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item){
    ///////////SOLO PARA LOS TOTALISADOS DE LA CABESERA
    let numero_documento;
    let cabesatota=0;
    let cabesatotn=0;
    ////////////////////////////////
    let n_item=numero_item+1;
    let items_validos=[];
    let items_validos2={};
    let items_promos2=[];
    for(let x in cotdetalle){
        numero_documento=cotdetalle[x][2];
        cabesatota+=parseFloat(cotdetalle[x][16]);
        cabesatotn+=parseFloat(cotdetalle[x][18]);
        for(let y in promdetalle){
            if(promdetalle[y][0]==cotdetalle[x][9]){
                let diferenciar_bonificacion=cotdetalle[x][13].substring(0,11);
                if(diferenciar_bonificacion!="GRATIS/PROM"){
                    items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                    items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][9],cotdetalle[x][18]]);
                    items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                }
            }
        }
    }
    let retorno_conjunto=suma_cantidades(items_validos,items_promos2,n_item,promcabesa);
    console.log("retorno revisar cantidades")
    console.log(retorno_conjunto)
    return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
}
function suma_cantidades(items_validos,items_promos2,n_item,promcabesa){
    ///recontruir esto para calcular segun el monto no las unidades
    let contador=0;
    let unidades_minimas=0;
    for(let item in items_validos) contador+=items_validos[item][6];
    for(let iprom in items_promos2) unidades_minimas=items_promos2[iprom][1];
    ///////REVIVIR EN CASO DE SER NECESITADO EMERGENCIA
    console.log("aqui esta el primer problema")
    console.log(contador)
    console.log("aqui esta el segundo problema")
    console.log(unidades_minimas)
    let division=contador/unidades_minimas;
    console.log("aqui esta el problema")
    console.log(division)
    let cantidad_promocion=Math.floor(division);
    console.log("aqui esta la cantidad a otorgar")
    console.log(cantidad_promocion);
    ///////APLICANDO LA DISPONIBILIDAD MAXIMA DE UNIDADES POR PROMOCION
    console.log("ESTE VALOR DEBE SER TESTEADO ANTES DE COMPARARLO PORQE ES PARA EL MAXIMO DE UNIDADES")
    console.log(promcabesa[7]);
    if(promcabesa[7]!=0){
        if(promcabesa[7]<=cantidad_promocion){
            console.log("aqui1")
            return [items_validos[0][0],items_validos[0][1],items_validos[0][2],items_validos[0][3],items_validos[0][4],"item nombre",n_item,promcabesa[7]];
        }
        // se esta ejecutando este
        else{return [items_validos[0][0],items_validos[0][1],items_validos[0][2],items_validos[0][3],items_validos[0][4],"item nombre",n_item,cantidad_promocion];}
    }
    else{
        return [items_validos[0][0],items_validos[0][1],items_validos[0][2],items_validos[0][3],items_validos[0][4],"item nombre",n_item,cantidad_promocion];
    }
}

//////PARA UNIDADES EN CONJUNTO
function m_unidades_conjunto(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item){
    ///////////SOLO PARA LOS TOTALISADOS DE LA CABESERA
    let numero_documento;
    let cabesatota=0;
    let cabesatotn=0;
    ////////////////////////////////
    let n_item=numero_item+1;
    let items_validos=[];
    let items_validos2={};
    let items_promos2=[];
    // let promo_terminada
    console.log("items en vacios")
    console.log(cotdetalle)

    for(let x in cotdetalle){
        ///capturando todos los montos del detallado
        numero_documento=cotdetalle[x][2]
        cabesatota+=parseFloat(cotdetalle[x][16]);
        cabesatotn+=parseFloat(cotdetalle[x][18]);

        for(let y in promdetalle){
            if(promdetalle[y][0]==cotdetalle[x][9]){
                let check_monto_prom=promdetalle[y][1];////MONTO MINIMO DE PROMOCION
                let check_monto_item=cotdetalle[x][14];///MONTO QUE TIENE LA COTIZACION
                let diferenciar_bonificacion=cotdetalle[x][13].substring(0,11);
                ////VERIFICANDO QUE EL MONTO SEA EL MINIMO REQUERIDO Y RETIRANDO ITEMS QUE SEAN REGALOS
                if(check_monto_item>=check_monto_prom && diferenciar_bonificacion!="GRATIS/PROM"){
                    
                    items_validos2[cotdetalle[x][9]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                    items_validos.push([cotdetalle[x][0],cotdetalle[x][1],cotdetalle[x][2],cotdetalle[x][3],cotdetalle[x][4],cotdetalle[x][13],cotdetalle[x][14]]);
///////variable construida para separar q descuento le toca en especifico con el item identicado en el detallado de la prom
                    items_promos2.push([promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]]);
                }
            }
        }
    }
    // let retorno_conjunto=suma_cantidades(items_validos,items_promos2,n_item);
    let retorno_conjunto;
    if(items_validos.length===0) return items_validos;
    else{
        retorno_conjunto=suma_cantidades2(items_validos,items_promos2,n_item);
        return [retorno_conjunto,items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];
    }
}
function suma_cantidades2(items_validos,items_promos2,n_item){
    // console.log("aqui estan items_validos",items_validos)
    // console.log("aqui estan items_promos",items_promos2)
    let contador=0;
    let unidades_minimas=0;
    for(let item in items_validos) contador+=items_validos[item][6];
    for(let iprom in items_promos2) unidades_minimas=items_promos2[iprom][1];
    let division=contador/unidades_minimas;
    ////no da las cantidades estimadas
    let cantidad_promocion=Math.floor(division);
    return [items_validos[0][0],items_validos[0][1],items_validos[0][2],items_validos[0][3],items_validos[0][4],"item nombre",n_item,cantidad_promocion];
}


module.exports=descuento_correspondiente;

let descuento_correspondiente=(codigos,cotdetalle,tipopromo,promcabesa,promdetalle)=>{
    //////FALTA UN FOR PARA SABER EN Q NUMERO DE ITEM SE ENCUENTRA
    let numero_item=1;
    numero_item=Object.keys(cotdetalle).length;
    let cantidad_correspondiente_obtenida;

    if(tipopromo["metrica"]==1){
        cantidad_correspondiente_obtenida=vx_valorizado(codigos,cotdetalle,tipopromo,promcabesa,promdetalle)
    }else{
        cantidad_correspondiente_obtenida=vx_unidad(codigos,cotdetalle,tipopromo,promcabesa,promdetalle)
    }
    // tipometrica==1 ? cantidad_correspondiente_obtenida=m_valorizado() : cantidad_correspondiente_obtenida=m_unidades(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item);
    return cantidad_correspondiente_obtenida;
}
function vx_valorizado(){}
function vx_unidad(codigos,cotdetalle,tipopromo,promcabesa,promdetalle){
    let objeto_regresar={};
    let items_correspondientes={};
    // let check_monto_prom=0;

    for(let y in promdetalle){
        if(codigos.includes(promdetalle[y][0])){
            let check_monto_prom=promdetalle[y][1];///UNIDADES MINIMAS QUE PIDE LA PROMO
            let check_monto_dsct=Number(promdetalle[y][2])///recuperado el descuento que se le otorga por promo  
            let check_monto_item=cotdetalle[promdetalle[y][0]]["cantidad"];
            let check_monto_precio=cotdetalle[promdetalle[y][0]]["preciosinIGV"];
            if(Number(check_monto_prom)<=Number(check_monto_item)){
            ///aca le estoi agregando al final el monto que le pide como minimo la promo lo usare en el bucle de abajo
            items_correspondientes[promdetalle[y][0]]=[check_monto_item,check_monto_precio,check_monto_prom,check_monto_dsct];
            }
        }
    }
    ///hace esto porqe necesita recojer de todos pero ahora solo necesita de 1x1
    let contador_momentane=0;
    for(let x in items_correspondientes){
        let unidades_minimas= items_correspondientes[x][2];
        let tengo_esta_cantidad= items_correspondientes[x][0];
        let cantidad_descuento= items_correspondientes[x][3];
        let division=Math.floor(Number(tengo_esta_cantidad)/Number(unidades_minimas));
        let corresponde= division*cantidad_descuento;

        objeto_regresar[contador_momentane]={}
        objeto_regresar[contador_momentane]["codigo"]=tipopromo["idprom"];
        objeto_regresar[contador_momentane]["descripcion"]=tipopromo["nombre"];
        objeto_regresar[contador_momentane]["cantidad"]=division;
        objeto_regresar[contador_momentane]["montoDescuento"]=corresponde;
        objeto_regresar[contador_momentane]["monedaDescuento"]="D";
        contador_momentane++;
    }
    if(Object.keys(objeto_regresar).length>0){
        ////esta linea es para ver si pasa la funcion 1 en el frontend
        objeto_regresar2["items"]=Object.values(objeto_regresar);
        ////sumado para saber si es descuento o regalo, si es 1 es descuento y si es 2 es regalo
        tipopromo["descuento"]=1 ? objeto_regresar2["tipo"]=["descuento"] : objeto_regresar2["tipo"]=["regalo"];
        return objeto_regresar2;
    }
    else{
        return "NO SUFICIENTE UNIDAD PARA ESTE ITEM";
    }
}

function m_unidades(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item){
    ///////////SOLO PARA LOS TOTALISADOS DE LA CABESERA
    let numero_documento;
    let cabesatota=0;
    let cabesatotn=0;
    ////////////////////////////////
    let n_item=numero_item+1;
    let items_validos2={};
    let items_promos2={};
    let promo_terminada

    for(let x in cotdetalle){
        ///capturando todos los montos del detallado
        numero_documento=cotdetalle[x][2]
        cabesatota+=parseFloat(cotdetalle[x][16]);
        cabesatotn+=parseFloat(cotdetalle[x][18]);

        for(let y in promdetalle){
            if(promdetalle[y][0]==cotdetalle[x][9]){
                let check_monto_prom=promdetalle[y][1];
                let check_monto_item=cotdetalle[x][14];
                let diferenciar_bonificacion=cotdetalle[x][13].substring(0,11);
                if(check_monto_item>=check_monto_prom && diferenciar_bonificacion!="GRATIS/PROM"){
                    items_validos2[cotdetalle[x][9]]=items_aceptados(cotdetalle[x],promdetalle[y],check_monto_item,check_monto_prom,n_item);
///////variable construida para separar q descuento le toca en especifico con el item identicado en el detallado de la prom
                    items_promos2[promdetalle[y][0]]=[promdetalle[y][0],promdetalle[y][1],promdetalle[y][2],promdetalle[y][3],promdetalle[y][4],promdetalle[y][5],promdetalle[y][6],promdetalle[y][7]];
                    n_item++;
                }
            }
        }
    }
    return [items_validos2,items_promos2,numero_documento,cabesatota,cabesatotn];

}

function items_aceptados(cotdetalle,promdetalle,check_monto_item,check_monto_prom,numero_item){
    let division=check_monto_item/check_monto_prom;
    let cantidad_promocion=Math.floor(division);
    //////////////////fecha,cdocu,ndocu,codcli,tcam,descripcion item,item,cant
    return [cotdetalle[0],cotdetalle[1],cotdetalle[2],cotdetalle[3],cotdetalle[4],cotdetalle[13],numero_item,cantidad_promocion];
}

module.exports=descuento_correspondiente;
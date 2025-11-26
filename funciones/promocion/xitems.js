
let descuento_correspondiente=(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica)=>{
    //////FALTA UN FOR PARA SABER EN Q NUMERO DE ITEM SE ENCUENTRA
    let numero_item=1;
    numero_item=Object.keys(cotdetalle).length;
    let cantidad_correspondiente_obtenida;
    tipometrica==1 ? cantidad_correspondiente_obtenida=m_valorizado() : cantidad_correspondiente_obtenida=m_unidades(nprom,cotdetalle,promcabesa,promdetalle,tipopromo,tipometrica,numero_item);
    return cantidad_correspondiente_obtenida;
}
function m_valorizado(){}

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
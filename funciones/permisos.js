/////esto se usara mas adelante para dar ciertos permisos por usuario
// const cotizacion=["crear","leer","update","delete"];
// const pedido=["crear","modificar","eliminar"];
// const factura=["modificar","despachar"];
// const listas=["cotizacion","pedidos","facturas"];
// const promocion=["crear","eliminar"];
// const reporte=["crear"];
// const cuota=["volumen","rentabilidad","cobertura"];
const cotizacion={
    "crear":[20,34,25,32],
    "leer":[20,25,32],
    "update":[20,25,34,32],
    "delete":[25,34,32],
    "alm":[20,25,34,32]
}

const pedido={
    "flete":[20,34]
}

// const pedido={
//     "crear":[20,34],
//     "leer":[20],
//     "update":[20,34],
//     "delete":[20,25,34],
//     "alm":[34]
// }

const factura={
    "despacho":[20,25],
    "transporte":[20,25],
    "atencion":[20,25,34],
    "direccion":[20,25],
    "vendedor":[20,25],
    "observacion":[20,25],
    "orden":[20,25]
}

const promocion={
    "crear":[],
    "leer":[],
    "update":[20,25,34],
    "delete cotizacion":[20,25,34],
    "delete pedido":[20,25,34]
}

const cuota={
    "crear":[20,25,34],
    "leer":[20,25,34],
    "update":[],
    "delete":[]    
}

const lista={
    "cotizacion":[20,25],
    "pedido":[20,25],
    "factura":[20,25],
    "clientes":[20,25]
}

const programador={
    "entregar":[20,34],
    "retirar":[]
}

const reporte={
    "stock":[25],
    "tiempo":[25],
    "precio":[25]
}


const permisos={}
permisos["cotizacion"]=cotizacion;
permisos["pedido"]=pedido;
permisos["factura"]=factura;
permisos["promocion"]=promocion;
permisos["cuota"]=cuota;
permisos["lista"]=lista;
permisos["programador"]=programador;
permisos["reporte"]=reporte;

module.exports=permisos;
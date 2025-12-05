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
    "crear":[20,34],
    "leer":[20],
    "update":[20,34],
    "delete":[20,25,34],
    "alm":[34]
}

const factura={
    "crear":[],
    "leer":[],
    "update":[20,25,34],
    "delete":[],
    "despachar":[20,25]
}

const promocion={
    "crear":[],
    "leer":[],
    "update":[20,25,34],
    "delete":[20,25,34]
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
    "factura":[20,25]
}

const programador={
    "entregar":[20],
    "retirar":[]
}


const permisos={}
permisos["cotizacion"]=cotizacion;
permisos["pedido"]=pedido;
permisos["factura"]=factura;
permisos["promocion"]=promocion;
permisos["cuota"]=cuota;
permisos["lista"]=lista;
permisos["programador"]=programador;

module.exports=permisos;
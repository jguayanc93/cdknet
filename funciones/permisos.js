/////esto se usara mas adelante para dar ciertos permisos por usuario
// const cotizacion=["crear","leer","update","delete"];
// const pedido=["crear","modificar","eliminar"];
// const factura=["modificar","despachar"];
// const listas=["cotizacion","pedidos","facturas"];
// const promocion=["crear","eliminar"];
// const reporte=["crear"];
// const cuota=["volumen","rentabilidad","cobertura"];
const cotizacion={
    "crear":[20,34],
    "leer":[20,25],
    "update":[20,34],
    "delete":[25,34],
    "alm":[20,34]
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
    "update":[20,34],
    "delete":[],
    "despachar":[20]
}


const permisos={}
permisos["cotizacion"]=cotizacion;
permisos["pedido"]=pedido;
permisos["factura"]=factura;
// permisos["promocion"]=promocion;

module.exports=permisos;
/////esto se usara mas adelante para dar ciertos permisos por usuario
const cotizacion=["crear","modificar","eliminar"];
// const pedidos=["crear","modificar","eliminar"];
const facturas=["modificar","despachar"];
const listas=["cotizacion","pedidos","facturas"];
const promocion=["crear","eliminar"];
const reporte=["crear"];
const cuota=["volumen","rentabilidad","cobertura"];

// const modulos_generales=[cotizacion,facturas,promocion,reporte];

const grp20={
    "cotizacion":"Permite manejar cotizaciones",
    "listas":"Lista tus ventas",
    "factura":"Permite manejar facturas",
    "promocion":"Permite adjuntar y retirar promociones",
    "cuota":"Ver el avance de las cuotas"
}
const grp25={
    "cotizacion":"Permite manejar cotizaciones",
    "promocion":"Permite adjuntar y retirar promociones",
    "reporte":"Permite sacar reportes de marcas"
};
const grp34={
    "factura":"Permite manejar facturas",
    "promocion":"Permite adjuntar y retirar promociones"
};
// const grp39=[];

const modulos = {};
modulos["grupo20"]=grp20;
modulos["grupo25"]=grp25;
modulos["grupo34"]=grp34;
// modulos["grupo39"]=grp39;

module.exports=modulos;
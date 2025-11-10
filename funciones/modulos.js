
const cotizacion=["crear","modificar","eliminar"];
// const pedidos=["crear","modificar","eliminar"];
const facturas=["modificar","despachar"];
const listas=["cotizacion","pedidos","facturas"];
const promocion=["crear","eliminar"];
const reporte=["crear"];
const cuota=["volumen","rentabilidad","cobertura"];

// const modulos_generales=[cotizacion,facturas,promocion,reporte];


// const grp20=[modulos_generales[0],"","","",""];
const grp20={
    "cotizacion":[cotizacion[0],cotizacion[1]],
    "listas":[listas[0],listas[1],listas[2]],
    "facturas":[facturas[0],facturas[1]],
    "promocion":[promocion[0],promocion[1]],
    "cuota":[cuota[0]]
}
const grp25={
    "cotizacion":[cotizacion[0],cotizacion[1],cotizacion[2]],
    "promocion":[promocion[0],promocion[1]],
    "reporte":[reporte[0]]
};
const grp34={
    "facturas":[facturas[0],facturas[1]],
    "promocion":[promocion[0],promocion[1]]
};
// const grp39=[];

const modulos = {};
modulos["grupo20"]=grp20;
modulos["grupo25"]=grp25;
modulos["grupo34"]=grp34;
// modulos["grupo39"]=grp39;

module.exports=modulos;
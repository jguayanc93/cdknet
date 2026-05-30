// const modulos_generales=[cotizacion,facturas,promocion,reporte];
const coti=["cotizacion","Permite manejar cotizaciones"];
const pedi=["pedido","Permite manejar pedidos"];
const factura=["factura","Modifica ciertos campos de la factura"];
const prom=["promocion","Permite adjuntar y retirar promociones"];
const listas=["listas","Lista tus ventas realizadas"];
const cuota=["cuota","Ver el avance de las cuotas"];
const reporte=["reporte","Permite sacar reportes de marcas"];
const despachador=["programador","Permite entregar factura a almacen"];


const grp20={
    [coti[0]]:coti[1],
    [pedi[0]]:pedi[1],
    [listas[0]]:listas[1],
    [factura[0]]:factura[1],
    [prom[0]]:prom[1],
    [cuota[0]]:cuota[1],
    [despachador[0]]:despachador[1]
}
const grp25={
    [coti[0]]:coti[1],
    [factura[0]]:factura[1],
    [prom[0]]:prom[1],
    [cuota[0]]:cuota[1],
    [reporte[0]]:reporte[1]
};
const grp34={
    [coti[0]]:coti[1],
    [listas[0]]:listas[1],
    [factura[0]]:factura[1],
    [prom[0]]:prom[1],
    [cuota[0]]:cuota[1],
    [despachador[0]]:despachador[1]
};
// const grp39=[];

const modulos = {};
modulos["grupo20"]=grp20;
modulos["grupo25"]=grp25;
modulos["grupo34"]=grp34;
// modulos["grupo39"]=grp39;

module.exports=modulos;
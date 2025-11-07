const error_corrector=(res,mensaje)=>{

    /////////RECUERDA ENVIAR LAS RESPUESTAS SEGUN EL MENSAJE ASI SABRAS COMO CAPTURARLAS EN EL OTRO LADO

    switch (mensaje) {
        case "error query":
            res.status(500).json({"status":mensaje,"codigo":1,"msg":"fallo la ejecucion de una consulta sql"})
            break;

        case "no cdk user":
            res.status(500).json({"status":mensaje,"codigo":1,"msg":"no esta registrado en el navachof"})
            break;

        case "falsa galleta":
            res.status(500).json({"status":mensaje,"codigo":1,"msg":"la galleta no existe en el frasco"})
            break;

        case "no identificado":
            res.status(400).json({"status":mensaje,"codigo":2,"msg":"el user no esta registrado en la intranet"})
            break;

        case "":
            res.status(500).json({"status":mensaje,"codigo":1,"msg":""})
            break;

        default:
            res.status(500).json({"status":"ERROR","codigo":1,"msg":"mensaje no encontrado en el corrector de errores"})
            break;
    }
}

module.exports={error_corrector}
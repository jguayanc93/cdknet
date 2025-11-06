const error_corrector=(res,mensaje)=>{

    /////////RECUERDA ENVIAR LAS RESPUESTAS SEGUN EL MENSAJE ASI SABRAS COMO CAPTURARLAS EN EL OTRO LADO

    switch (mensaje) {
        case "error query":
            res.status(500).json({"status":"ERROR","codigo":1,"msg":mensaje})
            break;

        case "no cdk user":
            res.status(500).json({"status":"ERROR","codigo":1,"msg":mensaje})
            break;

        case "falsa galleta":
            res.status(500).json({"status":"ERROR","codigo":1,"msg":mensaje})
            break;

        case "no identificado":
            res.status(400).json({"status":"ERROR","codigo":2,"msg":mensaje})
            break;

        case "":
            res.status(500).json({"status":"ERROR","codigo":1,"msg":mensaje})
            break;

        default:
            res.status(500).json({"status":"ERROR","codigo":1,"msg":"mensaje no encontrado en el corrector de errores"})
            break;
    }
}

module.exports={error_corrector}
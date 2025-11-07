const objevacio=(req,res,next)=>{
    let existentes=[];

    for(let propiedad in req.signedCookies){
        if(Object.hasOwn(req.signedCookies,propiedad)){
            existentes.push(propiedad);
        }
    }    

    if(existentes.length>0){ next(); }
    else{ next('route'); }
}

module.exports={objevacio}
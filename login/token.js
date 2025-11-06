const jws = require('jws');

let jwtgenerator = (obj) => {

    let userpayloaddata = {
        "identificador":obj[0],
        "nombre":obj[1],
        "codigo":obj[2],
        "id_area":obj[3],
        "nom_area":obj[4],
        "id_grupo":obj[5],
        "nom_grupo":obj[6]
    }

    const firma = {
        header:{alg:'HS256',"typ":"JWT"},
        payload:userpayloaddata,
        secret:'chistemas'
    }

    return jws.sign(firma);
}

module.exports={jwtgenerator}
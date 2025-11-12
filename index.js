require('dotenv').config();

const express = require('express')
const cors = require('cors')
const jwt = require('jws')
const cookieParser = require('cookie-parser')

const corhabilitaciones = require('./cors/conf')

const app = express();
const port = process.env.PORT || 3000;

// app.set('trust proxy','127.0.0.1');

app.use(cors(corhabilitaciones))

app.use([express.json(),cookieParser('CDK')])////este siempre data error en produccion

const ruta = require('./rutas/rutas')

app.use('/v1',express.static('public'))

app.use('/v1/login',ruta.login);

app.use('/v1/vendedor',ruta.vendedor);

app.use('/v1/cotizacion',ruta.coti)

app.use('/v1/cliente',ruta.cliente);

app.listen(port,()=>{console.log("servicio levantado")})
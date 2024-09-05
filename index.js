const express = require('express')
const {getConection} =require ('./db/db-connect-mongo');
const cors = require ('cors')
require ('dotenv').config();

const app = express()
const port = process.env.PORT

app.use(cors())

getConection();

app.use(express.json());

app.use('/usuario', require ('./router/user'));
app.use('/director', require ('./router/director'));
app.use('/genero', require ('./router/genero'));
app.use('/productora', require ('./router/productora'));
app.use('/tipo', require ('./router/tipo'));
app.use('/media', require ('./router/media'));

app.listen(port, () =>{
    console.log(`listening on port ${port}`)
});




const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose');
const productRouter = require('./routers/products')
const app = express()

//dotenv

require('dotenv/config')
const api = process.env.API_URL;
// http://localhost:3000/api/v1/product



//middleware
app.use(parser.json())
app.use(morgan('tiny'))

//router
app.use(`${api}/products`,productRouter)








//database connection 
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'e-data'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})

app.listen(3000,()=>{
   
    console.log('server is running http://localhost:3000')
})
const express = require('express');
const cors = require('cors')
const parser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose');
const productRouter = require('./routers/products')
const cateoriesRouter = require('./routers/category')
const userRouter = require('./routers/user');
const orderRouter = require('./routers/order')
const authJwt = require('./helper/jwt');
const errorHander = require('./helper/errorhandler')
const app = express()

//dotenv

require('dotenv/config')
const api = process.env.API_URL;
// http://localhost:3000/api/v1/product


app.use(cors());
app.options('*',cors())
//middleware
app.use(parser.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHander)


//router
app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,cateoriesRouter)
app.use(`${api}/users`,userRouter)
app.use(`${api}/orders`,orderRouter)








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
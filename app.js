const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const productRoute = require('./end-points/products/productRoute')
const userRoutes = require('./end-points/users/usersRoute')
app.use(cors())
app.use(express.json())
//users/forgetPassword
app.use('/users/',userRoutes)
app.use('/products/',productRoute)
mongoose.connect(
    "mongodb://localhost/quickPhotos"
    ,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log('connected to database successfully')
}).catch((err)=>{
    console.log('error has occured when connecting database '+err)
})
app.listen(5000,()=>{
    console.log("server started on port "+5000)
    require('./constants').Port = 5000
})

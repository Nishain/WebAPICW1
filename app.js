const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const constants = require('./constants')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
app.use(cors({credentials:true,origin:constants.clientURL}))
app.use(cookieParser())
app.use(express.json())
app.use('/districts/',require('./end-points/districts/districtRoute'))
app.use(require('./middleware/IPCheck'))
app.get('/',(req,res)=>{
    return res.send({pingSuccess:true})
})
app.use(require('./middleware/CheckCookie'))
app.use('/auth/',require('./end-points/auth/auth'))
app.use('/users/',require('./end-points/users/usersRoute'))
app.use('/products/',require('./end-points/products/productRoute'))
app.use((req,res)=>{
    res.status(404).send({
        error:true,
        message:"didn't match any route"
    })
})
mongoose.connect(
    "mongodb://localhost/quickPhotos"
    ,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log('connected to database successfully')
}).catch((err)=>{
    console.log('error has occured when connecting database '+err)
})
mongoose.set('useCreateIndex', true)
app.listen(process.env.PORT,()=>{
    console.log("server started on port "+process.env.PORT)
})

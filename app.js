const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(require('./middleware/IPCheck'))
//users/forgetPassword
app.use('/auth/',require('./end-points/auth/auth'))
app.use('/users/',require('./end-points/users/usersRoute'))
app.use('/products/',require('./end-points/products/productRoute'))
mongoose.connect(
    "mongodb://localhost/quickPhotos"
    ,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log('connected to database successfully')
}).catch((err)=>{
    console.log('error has occured when connecting database '+err)
})
app.listen(process.env.PORT,()=>{
    console.log("server started on port "+process.env.PORT)
})

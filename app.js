const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const constants = require('./constants')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const app = express()
// const generateSalt = async () =>{
//     console.log(await require('bcrypt').genSalt(1))
// }
// generateSalt()
app.use(cors({credentials:true,origin:constants.clientURL}))
app.use(cookieParser())
app.use(express.json())

app.use(require('./middleware/IPCheck'))
app.use('/auth/',require('./end-points/auth/auth'))
//app.use(require('./middleware/CheckCookie'))
app.use('/districts/',require('./end-points/districts/districtRoute'))
app.get('/',(req,res)=>{
    return res.send({pingSuccess:true})
})
app.use('/users/',require('./end-points/users/usersRoute'))
app.use('/products/',require('./end-points/products/productRoute'))
app.use('/Admin/',require('./end-points/Admin/Category/category'))
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
constants.default.loadEnums()
app.listen(process.env.PORT,()=>{
    console.log("server started on port "+process.env.PORT)
})

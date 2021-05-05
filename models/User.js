const mongoose = require('mongoose')
const schema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    address:String,
    city:String,
    zipCode:Number,
    password:String,
    phoneNumber:String,
    incorrectTries:{
        default:0,
        type:Number
    }
})
module.exports = mongoose.model("User",schema)
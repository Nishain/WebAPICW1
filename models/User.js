const mongoose = require('mongoose')
const schema = mongoose.Schema({
    email:String,
    password:String,
    phoneNumber:String,
    incorrectTries:{
        default:0,
        type:Number
    }
})
module.exports = mongoose.model("User",schema)
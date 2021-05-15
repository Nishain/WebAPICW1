const mongoose = require('mongoose') 
const schema = mongoose.Schema({
    ip:String,
    lastDate:{
        type:Date,
        default:new Date().toISOString()//Date.now
    },
    attempts:{
        type:Number,
        default:1
    },
})
module.exports = mongoose.model("BlockedIP",schema)
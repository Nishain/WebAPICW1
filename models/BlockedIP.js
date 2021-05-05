const mongoose = require('mongoose') 
const schema = mongoose.Schema({
    ip:String,
    lastDate:{
        type:Date,
        default:Date.now
    },
    attempts:{
        type:Number,
        default:1
    },
})
module.exports = mongoose.model("BlockedIP",schema)
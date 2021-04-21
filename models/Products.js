const mongoose = require('mongoose')
const categories = ['unknown']
const schema = mongoose.Schema({
    name:{
        required : true,
        type:String
    },
    price:{
        default:0,
        type:Number
    },
    discount:{
        default:0,
        type:Number
    },
    category:{
        type:String,
        enum:categories
    }
})
module.exports = mongoose.model(schema,"Product")

const mongoose = require('mongoose')
const schema = mongoose.Schema({
    id:{
        required:true,
        type:Number
    },
    districtName:{
        required:true,
        type:String
    },
    value:{
        required:true,
        type:Number
    },
    CourierServiceName:{
        required:true,
        type:String
    }


})
const CourierService =  mongoose.model('courierservice',schema)
module.exports = CourierService
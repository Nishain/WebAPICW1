const mongoose = require('mongoose')
const schema = mongoose.Schema({
    invoiceNo:{
        required:true,
        type:String
    },
    TotalAmount:{
        required:true,
        type:Number
    },
    DateierServiceName:{
        required:true,
        type:String
    }
})
const Invoice =  mongoose.model('Invoice',schema)
module.exports = Invoice
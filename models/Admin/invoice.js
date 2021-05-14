const mongoose = require('mongoose')
const schema = mongoose.Schema({
    invoiceNo:{
        required:true,
        type:Number
    },
    TotalAmount:{
        required:true,
        type:Number
    },
    Date:{
        required:true,
        type:Date
    },
    paymentStatus:{
        required:true,
        type:String
    },

})
const Invoice =  mongoose.model('invoice',schema)
module.exports = Invoice
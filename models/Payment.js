const mongoose = require('mongoose')
const schema = mongoose.Schema({
    InvoiceNumber:{
        required:true,
        type:String
    },
    PaymentId:{
        required:true,
        type:Number
    },
    Amount:{
        required:true,
        type:String
    },
    Status:{
        required:true,
        type:String
    },
    Method:{
        required:true,
        type:String
    },
    Date:{
        required:true,
        type:Date
    }
})
const Payment =  mongoose.model('Payment',schema)
module.exports = Payment
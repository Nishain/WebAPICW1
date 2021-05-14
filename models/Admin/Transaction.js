const mongoose = require('mongoose')
const schema = mongoose.Schema({
    InvoiceNumber:{
        required:true,
        type:Number
    },
    PaymentId:{
        required:true,
        type:Number
    },
    Amount:{
        required:true,
        type:Number
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
    },

})
const Transaction =  mongoose.model('transaction',schema)
module.exports = Transaction
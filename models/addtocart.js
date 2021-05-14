const mongoose = require('mongoose')
const schema = mongoose.Schema({
    categoryName:{
        required:true,
        type:String
    },
    qty:{
        required:true,
        type:Number
    },
    photoURL:{
        required:true,
        type:String
    },
    Date:{
        required:true,
        type:Date
    },
    Price:{
        required:true,
        type:Number
    }
  

})
const AddToCart =  mongoose.model('addtocart',schema)
module.exports = AddToCart
const mongoose = require('mongoose')
const schema = mongoose.Schema({
    categoryName:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    }

})
const Category =  mongoose.model('category',schema)
module.exports = Category
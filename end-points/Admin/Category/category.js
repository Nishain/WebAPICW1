const router= require('express').Router()
const Category = require('../../../models/Admin/Category')
const Helper = require('../../helper')
function mapRequestBodyToSchema(req){
    var obj = {}
    for(key in req.body){
        obj[key] = req.body[key]
    }
    return new Category(obj)
}
router.get('/category',async (req,res)=>{

    const categoryList = await Category.find()
    res.send(categoryList)
})
router.get('/category/:id',async (req,res)=>{
    const categoryitem = await Category.findById(req.params.id)
    if(categoryitem)
        return res.send(categoryitem)
    else
        return Helper.notFound(res)
})
router.post('/category',async (req,res)=>{
    const newCategory = mapRequestBodyToSchema(req)
    try {
        await newCategory.save()
        res.send({success:true,message:'email successfully sent!'})
    } catch (error) {
        return Helper.badRequest(res,error)
    }  
})
router.put('/:id',async (req,res)=>{
    const category = await Category.findById(req.params.id)
    if(category)
        res.send()
})
module.exports = router
const router= require('express').Router()
const Category = require('../../../models/Admin/Category')
const Helper = require('../../helper')
const {
    categoryValidation
  } = require('../../../middleware/category.validation');
function mapRequestBodyToSchema(req){
    var obj = {}
    for(key in req.body){
        obj[key] = req.body[key]
    }
    return new Category(obj)
}
router.get('/category',async (req,res)=>{

    const categoryList = await Category.find()
    if(!categoryList)
    {
        return res.status(404).send("no such category")
    }
    else{
    res.send(categoryList)
    }
})
router.get('/category/:id',async (req,res)=>{
    const categoryitem = await Category.findById(req.params.id)
    if(categoryitem)
        return res.send(categoryitem)
    else
        return Helper.notFound(res)
})
router.post('/category',categoryValidation,async (req,res)=>{
   
    const newCategory = mapRequestBodyToSchema(req)
    try {
        await newCategory.save()
        res.send({success:true,message:'category Added Successfully'})
    } catch (error) {
        return Helper.badRequest(res,error)
    }  
})
router.put("/category/:id",categoryValidation,async (req,res)=>{
    let reqID=req.params.id
    let category= await Category.findById(reqID);

    if(!category){
        return res.status(404).send("no such category")
    }
    category.set({price: req.body.price});
    category=await category.save();
    return res.send("Category updated successfully");

});
router.delete("/category/:id",async(req,res)=>{
    let reqID=req.params.id
    let category=await Category.findByIdAndDelete(reqID);
    if(!category){
        return res.status(404).send("no such Category")
    }


    res.send(category);

});
module.exports = router
const router = require('express').Router()
const Product = require('../../models/Products')
const Helper = require('../helper')
router.get('/',async (req,res)=>{
    res.send(await Product.find())
})
router.get('/:id',async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product)
        return res.send(product)
    else
        return Helper.notFound(res)
})
router.post('/',async (req,res)=>{
    const requestBody = Helper.mapRequestBodyToObject(req)
    try { 
        res.send(await new Product(requestBody).save())
    } catch (error) {
        return Helper.badRequest(res,error)
    }
})
router.put('/:id',async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product)
        res.send()
})
module.exports = router
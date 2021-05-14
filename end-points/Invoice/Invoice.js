const router= require('express').Router()
const Invoice = require('../../../models/Invoice')
const Payment = require('../../../models/Payment')
const Helper = require('../../helper')
const Invoice = require('../../models/Invoice')

function mapRequestBodyToSchema(req){
    var obj = {}
    for(key in req.body){
        obj[key] = req.body[key]
    }
    return new Invoice(obj)
}

router.get('/Invoice',async (req,res)=>{

    const invoiceList = await Invoice.find()
    res.send(invoiceList)
})

router.get('/Invoice/:id',async (req,res)=>{
    const invoiceitem = await Invoice.findById(req.params.id)
    if(invoiceitem)
        return res.send(invoiceitem)
    else
        return Helper.notFound(res)
})
router.post('/Invoice',async (req,res)=>{
    const newInvoice = mapRequestBodyToSchema(req)
    try {
        await newInvoice.save()
        res.send({success:true,message:'Invoice Created Successfully!'})
    } catch (error) {
        return Helper.badRequest(res,error)
    }  
})
// router.put("/Invoice/:id",async (req,res)=>{
//     let reqID=req.params.id
//     let Invoice = await Invoice.findById(reqID);

//     if(!Invoice){
//         return res.status(404).send("no such Invoice")
//     }
//     Invoice.set({price: req.body.price}); // add all fields
//     Invoice =await Invoice.save();
//     return res.send("Invoice updated successfully");

// });
// router.delete("/Invoice/:id",async(req,res)=>{
//     let reqID=req.params.id
//     let Invoice=await Invoice.findByIdAndDelete(reqID);
//     if(!Invoice){
//         return res.status(404).send("no such Invoice")
//     }


//     res.send(Invoice);

// });
module.exports = router
const router= require('express').Router()
const Transaction = require('../../../models/Admin/Transaction')
const Helper = require('../../helper')

router.post('/transaction',async (req,res)=>{
   
     
    if(!req.body.InvoiceNumber){
        return res.status(400).send("name is empty");
    }
    else if(!req.body.PaymentId){
        return res.status(400).send("TotalAmount is empty");
    }
    else if(!req.body.Amount){
        return res.status(400).send("Date is empty");
    }
   else if(!req.body.Status){
        return res.status(400).send("paymentStatus is empty");
    }
   else if(!req.body.Method){
        return res.status(400).send("paymentStatus is empty");
    }
   else if(!req.body.Date){
        return res.status(400).send("paymentStatus is empty");
    }

   let newTransaction= new Transaction({
    InvoiceNumber:req.body.InvoiceNumber,
    PaymentId:req.body.PaymentId,
    Amount:req.body.Amount,
    Status:req.body.Status,
    Method:req.body.Method,
    Date:req.body.Date,
    })

    try{
        newTransaction=await newTransaction.save();
        return res.send(newTransaction);
    } catch (error) {
        return Helper.badRequest(res,error)
    } 
});
router.get("/transaction",async (req,res)=>{
    try{
        let transaction= await Transaction.find();
        res.send(transaction);
    }catch(ex){
        return Helper.badRequest(res,error)
    }
    
});

module.exports = router
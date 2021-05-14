const router= require('express').Router()
const AddToCart = require('../models/addtocart')
const Helper = require('./helper')

router.post('/',async (req,res)=>{
   
     
    if(!req.body.categoryName){
        return res.status(400).send("name is empty");
    }
    else if(!req.body.qty){
        return res.status(400).send("TotalAmount is empty");
    }
    else if(!req.body.photoURL){
        return res.status(400).send("Photo is empty");
    }
    else if(!req.body.Price){
        return res.status(400).send("Price is empty");
    }
    else if(!req.body.unitPrice){
        return res.status(400).send("Price is empty");
    }

   let newAddToCart= new AddToCart({
    categoryName:req.body.categoryName,
    qty:req.body.qty,
    photoURL:req.body.photoURL,
    Price:req.body.Price,
    unitPrice:req.body.unitPrice,
    Date:new Date(),
    })

    try{
        newAddToCart=await newAddToCart.save();
        return res.send(newAddToCart);
    } catch (error) {
        return Helper.badRequest(res,error)
    } 
});
router.get("/",async (req,res)=>{
    try{
        let cart= await AddToCart.find();
        res.send(cart);
    }catch(ex){
        return Helper.badRequest(res,error)
    }
});

router.delete("/:id",async(req,res)=>{
    let reqID=req.params.id
    let deleteItem=await AddToCart.findByIdAndDelete(reqID);
    if(!deleteItem){
        return res.status(404).send("no such Item")
    }


    res.send(deleteItem);

});

module.exports = router
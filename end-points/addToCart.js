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

   let newAddToCart= new AddToCart({
    categoryName:req.body.categoryName,
    qty:req.body.qty,
    photoURL:req.body.photoURL,
    Price:req.body.Price,
    Date:new Date(),
    })

    try{
        newAddToCart=await newAddToCart.save();
        return res.send(newAddToCart);
    } catch (error) {
        return Helper.badRequest(res,error)
    } 
});
// router.get("/invoice",async (req,res)=>{
//     try{
//         let invoice= await Invoice.find();
//         res.send(invoice);
//     }catch(ex){
//         return Helper.badRequest(res,error)
//     }
    
// });
// router.get("/invoice/:id",async(req,res)=>{
    
//     let reqID=req.params.id
//     try{
//         let invoice= await Invoice.findById(reqID);
//         res.send(invoice);
//     }catch(ex){
//         return Helper.badRequest(res,error)
//     }

  
// });

module.exports = router
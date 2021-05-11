const router= require('express').Router()
const CourierService = require('../../../models/Admin/CourierService')
const Helper = require('../../helper')
function mapRequestBodyToSchema(req){
    var obj = {}
    for(const key in req){
        obj[key] = req[key]
    }
    return new CourierService(obj)
}
router.get('/courierservice',async (req,res)=>{

    const courierserviceList = await CourierService.find()
    res.send(courierserviceList)
})
router.post('/courierservice',async (req,res)=>{

   try {
   req.body.map(async (element) => { const newCourierService = mapRequestBodyToSchema(element)
    
        await newCourierService.save()
        
       } )
       res.send({success:true,message:'Data Added !'})
    } catch (error) {
        return Helper.badRequest(res,error)
    }
    
})
module.exports = router
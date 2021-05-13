const router = require("express").Router();
const CourierService = require("../../models/Admin/CourierService");
const Helper = require("../helper");
const _ = require("lodash");
const {
  courierServiceValidation
} = require('../../middleware/CourierService.validatetion');
function mapRequestBodyToSchema(req) {
  var obj = {};
  for (const key in req) {
    obj[key] = req[key];
  }
  return new CourierService(obj);
}
router.get("/courierservicename", async (req, res) => {
  const courierserviceList = await CourierService.find();
  const cNames = courierserviceList.map((c) => c.CourierServiceName);
  res.send(_.uniq(cNames));
});
router.get("/courierservice", async (req, res) => {
  const courierserviceList = await CourierService.find();
  res.send(courierserviceList);
});
router.get("/courierserviceresult/:id", async (req, res)=>{
    const courierserviceList = await CourierService.find({CourierServiceName:req.params.id})
    if(courierserviceList)
        return res.send(courierserviceList)
    else
        return Helper.notFound(res)
})
router.put("/courierservice/:id",async (req,res)=>{
    req.body.map(async (element) => {
    let reqID=element._id
    let courierservice= await CourierService.findById(reqID);

    if(!courierservice){
        // return res.status(404).send("no such category")
    }
    courierservice.set({CourierServiceName: element.CourierServiceName,value:element.value,districtName:element.districtName});
    courierservice=await courierservice.save();
});
    return res.send("Category updated successfully");

});
router.post("/courierservice", async (req, res) => {
  try {
    req.body.map(async (element) => {
      const newCourierService = mapRequestBodyToSchema(element);

      await newCourierService.save();
    });
    res.send({ success: true, message: "Data Added !" });
  } catch (error) {
    return Helper.badRequest(res, error);
  }
});
router.delete("/courierservice/:id",async(req,res)=>{
    let reqID=req.params.id
    let courierserviceList=await await CourierService.find({CourierServiceName:reqID})
    courierserviceList.map(async (element) => {

    let courierservice2=await CourierService.findByIdAndDelete(element._id);

});
res.send({ success: true, message: "Data Deleted !" });

});
module.exports = router;

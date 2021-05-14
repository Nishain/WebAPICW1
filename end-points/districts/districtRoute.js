const router = require('express').Router()
const District = require('../../models/Districts')
router.get('/',async (req,res)=>{
    const districtList = await District.find()
    res.send({ignoreAsNormal:true,list:districtList})
})
module.exports = router
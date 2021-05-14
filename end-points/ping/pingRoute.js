const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
router.get('/normal',(req,res)=>{
    return res.send({pingSuccess:true})
})
router.get('/admin',async (req,res)=>{
    var data
    try {
        data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
    } catch (error) {
        return res.status(401).send({adminDomain:true})
    }
    const targetUser = await User.findOne({email:data.email,isLogged:true})
    if(!targetUser)
        return res.status(401).send({adminDomain:true})
    if(targetUser.isAdmin)
        return {isUserAdmin : true}
    else    
        return res.status(401).send({adminDomain:true})
})
module.exports = router
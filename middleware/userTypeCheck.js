const Helper = require('../end-points/helper');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const getUserType = async (req,res,next)=>{
    const exceptionList = ['/Admin/courierservicename','/Admin/invoice']
    if(exceptionList.findIndex(p=>req.path.startsWith(p)) > -1)
        return next()
    var data
    try{
        data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
    }catch(error){
        return next()
    }
    const targetUser = await User.findOne({email:data.email,isLogged:true})
    if(!targetUser)
        return next()
    if(targetUser.isAdmin)
        return next()
    return res.status(401).send({adminDomain:true})//Helper.accessDenyUser('non-admin','only admins can access these domains',res)   
}
module.exports = getUserType
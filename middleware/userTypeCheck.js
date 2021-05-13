const Helper = require('../end-points/helper');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const getUserType = async (req,res,next)=>{
    const exceptionList = []
    if(exceptionList.findIndex(p=>req.path.startsWith(p)) > -1)
    return next()
    const data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
    const targetUser = await User.findOne({email:data.email,isLogged:true})
    if(!targetUser)
        return next()
    if(targetUser.isAdmin)
        return next()
    return Helper.accessDenyUser('non-admin','only admins can access these domains',res)   
}
module.exports = getUserType
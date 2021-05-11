const jwt = require('jsonwebtoken');
const helper = require('../end-points/helper');
const User = require('../models/User')
module.exports = async function checkCookie(req, res, next) {
  console.log(req.path)
  const exceptions = ['/users/','/users/forgetPassword']  
  if(exceptions.findIndex(p=>req.path.startsWith(p)) > -1)
    return next()
   
  if (!req.cookies.jwt) {
        console.log(`no token ${req.path}`)
        return helper.invalidToken(res,'no token found')
  } else {
    try {
      const data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
      const targetUser = await User.findOne({email:data.email,isLogged:true})
      if(!targetUser) 
        return helper.invalidToken(res,'user in token is not valid logged user')
      if(!targetUser.isActive)
        return res.status(401).send({accountInActive:true})
    } catch (error) {
        console.log(`no token ${req.path}`)
        return helper.invalidToken(res,'invalid token')
    }
  }
  next();
};

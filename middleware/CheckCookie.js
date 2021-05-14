const jwt = require('jsonwebtoken');
const helper = require('../end-points/helper');
const User = require('../models/User')
module.exports = async function checkCookie(req, res, next) {
  console.log(req.path)
  //'/users/',
  console.log(req.method)
  const exceptions = [
    {method:'POST',path:'/users/'},
    '/districts/']  
  if(exceptions.findIndex(exception=>{
    if(typeof exception == 'object' && req.path.startsWith(exception.path) && exception.method == req.method) 
      return true
    if(typeof exception == 'string' && req.path.startsWith(exception))  
      return true
    return false  
  }) > -1)
    return next()
   
  if (!req.cookies.jwt) {
        console.log(`no token ${req.path}`)
        return helper.invalidToken(res,'no token found')
  } else {
    try {
      const data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
      const targetUser = await User.findOne({email:data.email,isLogged:true,sessionCode:data.sessionCode})
      if(!targetUser) 
        return helper.invalidToken(res,'user in token is not valid logged user')
      if(!targetUser.isActive)
        return helper.reportAccountDeactivated(res)
      res.locals.userEmail = targetUser.email
      res.locals.isAdmin = targetUser.isAdmin || false 
      console.log('set locals')
    } catch (error) {
        console.log(`no token ${req.path}`)
        return helper.invalidToken(res,'invalid token')
    }
  }
  next();
};

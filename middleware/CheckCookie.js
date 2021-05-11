const jwt = require('jsonwebtoken');
const helper = require('../end-points/helper');
const User = require('../models/User')
module.exports = async function checkCookie(req, res, next) {
  console.log(req.path)
  const exceptions = ['/users/','/users/forgetPassword']  
  if(exceptions.findIndex(p=>req.path.startsWith(p)) > -1)
    return next()
   
  if (!req.cookies.jwt) {
        return helper.invalidToken(res,'no token found')
  } else {
    try {
      const data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
      const targetUser = User.findOne({email:data.email,isLogged:true})
      if(!targetUser) 
        return helper.invalidToken(res,'user in token is not valid logged user')
      console.log("token email "+data.email);
    } catch (error) {
        return helper.invalidToken(res,'invalid token')
    }
  }
  next();
};

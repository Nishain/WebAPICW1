const jwt = require('jsonwebtoken')
module.exports = function checkCookie(req, res, next) {
  if (!req.cookies.jwt) {
        return res.status(401).send({invalidToken:true,message:'no token found'})
  } else {
    try {
      console.log(process.env.jwtSecret)  
      const data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret);
      console.log("token email "+data.email);
    } catch (error) {
        return res.status(401).send({invalidToken:true,message:'invalid token'})
    }
  }
  next();
};

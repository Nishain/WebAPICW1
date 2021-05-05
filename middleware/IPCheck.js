const BlockedIP = require('../models/BlockedIP')
async function IPCheck(req,res,next){
    const foundIP = await BlockedIP.findOne({ip:req.ip})
    if(foundIP && foundIP.attempts > 3)
        return res.status(401).send({IPBlocked:true,message:"Your IP is being tempolary blocked",from:foundIP.lastDate})
    next()
}
module.exports = IPCheck
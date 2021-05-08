const BlockedIP = require('../models/BlockedIP')
const contants = require('../constants')
async function IPCheck(req,res,next){
    const foundIP = await BlockedIP.findOne({ip:req.ip})
    if(foundIP && foundIP.attempts > 2)
        return res.status(401).send(
            {
                IPBlocked:true,
                message:contants.IPBlockedMsg,
                from:foundIP.lastDate
            })
    next()
}
module.exports = IPCheck
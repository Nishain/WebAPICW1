const BlockedIP = require('../models/BlockedIP')
const contants = require('../constants')
const mongoose = require('mongoose')
async function IPCheck(req,res,next){
    const foundIP = await BlockedIP.findOne({ip:req.ip})
    //console.log(Date.now)
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
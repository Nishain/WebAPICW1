const BlockedIP = require('../models/BlockedIP')
const contants = require('../constants')
const mongoose = require('mongoose')
async function IPCheck(req,res,next){
    const foundIP = await BlockedIP.findOne({ip:req.ip})
    if(foundIP){
        const lastDate = new Date(foundIP.lastDate)
        const newDate = lastDate
        newDate.setSeconds(lastDate.getSeconds()+10)
        if(new Date().getTime() > newDate.getTime()){
            console.log('greater time')
             await foundIP.delete()
             return next()
        }
    }
        
    if(foundIP && foundIP.attempts > 2){
        
        return res.status(401).send(
            {
                IPBlocked:true,
                message:contants.IPBlockedMsg,
                from:foundIP.lastDate
            })
        }
    next()
}
module.exports = IPCheck
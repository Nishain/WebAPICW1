const router = require('express').Router()
const User = require('../../models/User')
const BlockedIP = require('../../models/BlockedIP')
router.get('/ip/:ip',async (req,res)=>{
    const foundIP = await BlockedIP.findOne({ip:req.params.ip})
    if(foundIP && foundIP.attempts > 3)
        return res.send({blocked:true})
    return res.send({blocked:false})    
})
router.post('/',async (req,res)=>{
    let email = req.body["email"]
    let password = req.body["password"]
    if (!(typeof email == 'string' && typeof password == 'string'))
        return Helper.badRequest(res,"provide valid email and password on body")
    const user = await User.findOne({email:email,password:password})
    if(user)
        res.send({message:'you are authenticated'})
    else{
        const blockedIP = await BlockedIP.findOne({ip:req.ip})
        if(blockedIP){
            var params = {lastDate:Date.now()}
            if (blockedIP.attempts > 3){
                await blockedIP.set(params).save()
                return res.status(401).send({message:'you have exceeded 3 attempts.Your IP is backlisted now'})
            }else{
                params.attempts = blockedIP.attempts + 1
            }
            await blockedIP.set(params).save()
        }else{
            await new BlockedIP({ip:req.ip}).save()
        }
        res.send({message:'unauthorized'})    
    }
})
module.exports = router
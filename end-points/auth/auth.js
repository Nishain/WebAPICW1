const router = require('express').Router()
const User = require('../../models/User')
const BlockedIP = require('../../models/BlockedIP')
const constants = require('../../constants')
const jwt = require('jsonwebtoken')
const helper = require('../helper')
router.get('/ip/:ip',async (req,res)=>{
    const foundIP = await BlockedIP.findOne({ip:req.params.ip})
    if(foundIP && foundIP.attempts > 3)
        return res.send({blocked:true})
    return res.send({blocked:false})    
})
router.post('/',async (req,res)=>{
    let email = req.body["email"]
    let password = req.body["password"]
    console.log(`${email} ${password}`)
    if (!helper.validateFields(req,res,{email:'String',password:'String'}))
        return
    const user = await User.findOne({email:email,password:password})
    if(user){
        BlockedIP.findOneAndRemove({ip:req.ip})
        res.cookie('jwt',{
            token:jwt.sign({email:email},
            process.env.jwtSecret,//secret
            {expiresIn:'1h'})
        }).send({authorize:true,message:'you are authenticated'})
    }
    else{
        const blockedIP = await BlockedIP.findOne({ip:req.ip})
        if(blockedIP){
            var params = {lastDate:Date.now()}
            if (blockedIP.attempts > 2){
                await blockedIP.set(params).save()
                return res.status(401).send({message:constants.exceedAttemptsLogin})
            }else{
                params.attempts = blockedIP.attempts + 1
            }
            await blockedIP.set(params).save()
        }else{
            await new BlockedIP({ip:req.ip}).save()
        }
        res.send({authorize:false,message:'unauthorized',attemptsRemain: 3 - (params.attempts || 1)})    
    }
})
module.exports = router
const router = require('express').Router()
const User = require('../../models/User')
const BlockedIP = require('../../models/BlockedIP')
const constants = require('../../constants')
const jwt = require('jsonwebtoken')
const helper = require('../helper')


router.post('/',async (req,res)=>{
    authenticate(false,req,res)
})
async function authenticate(thirdParty,req,res){
    var user = false
    if(thirdParty){
        if(typeof req.body.linkID != 'string')
            return res.status(400).send({fieldError:true,message:'require provider user ID'})
        const linkID = req.body.linkID 
        user = await User.findOne({quickSignInID : linkID})
    }else{
        let email = req.body["email"]
        let password = req.body["password"]
        if (!helper.validateFields(req,res,{email:'String',password:'String'}))
            return
        user = await User.findOne({email:email,password:password})
    }
    if(user){
        const blockedIP = BlockedIP.findOne({ip:req.ip})
        if(blockedIP){
            await blockedIP.deleteOne()
        }
        if(!user.isEmailConfirmed){
            return res.send({requiredToConfirm:true})
        }
        await user.set({isLogged:true}).save()
        helper.sendJWTAuthenticationCookie(res,user.email)
        .send({authorize:true,message:'you are authenticated'})
    }
    else{
        if(thirdParty)
            return res.send({requireRegistration : true})
        const blockedIP = await BlockedIP.findOne({ip:req.ip})
        var params = {lastDate:Date.now()}
        if(blockedIP){
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
}
router.post('/link',async (req,res)=>{
    authenticate(true,req,res)
})
router.get('/signout',async (req,res)=>{
    let data
    try{
        data = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret)
    }catch(error){
        return helper.invalidToken(res,'not valid token to sign out')
    }
    
    const loggedUser = await User.findOne({email:data.email})
    if(!loggedUser){
        return res.status(400).send({error:true,message:'not a valid user'})
    }
    await loggedUser.set({isLogged:false}).save()
    return res.send({signOut:true,email:data.email})
})
module.exports = router
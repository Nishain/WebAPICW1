const router = require('express').Router()
const User = require('../../models/User')
const BlockedIP = require('../../models/BlockedIP')
const constants = require('../../constants')
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const Helper = require('../Helper')
const RandomCodeGenerator = require('randomatic');
const bycrypt = require('bcrypt')
const urlSafeBase64 = require('url-safe-base64')
const transporter = nodeMailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.email,
        pass:process.env.password
    },tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
})
var emailOptions = {
    from:process.env.email,
    to:''
}
async function sendCodeToEmail(role,req,res){
    console.log({
        user:process.env.email,
        password:process.env.password
    })
    if(typeof req.body.email != 'string')
        return Helper.fieldError(res,'Please provide a valid email address',['email'])
    emailOptions.to = req.body.email
    
    const targetUser = await User.findOne({email:req.body.email})
    if(!targetUser)
        return Helper.fieldError(res,'email does not exist',['email'])
    const code = (role == 'forgetPassword') ? urlSafeBase64.encode(await bycrypt.hash(req.body.email + RandomCodeGenerator('Aa0',10),1)): RandomCodeGenerator('A0',10)
    emailOptions = (role == 'forgetPassword') ? constants.designEmailContent(code,emailOptions) 
        : constants.designEmailConfimationBody(code,emailOptions)
    
    transporter.sendMail(emailOptions,async (err,data)=>{
        if(err){
            res.send({success:false,message:err})
        }else{
            const paramBody = (role == 'forgetPassword') ? {forgetPasswordCode:code} : {emailConfirmationCode:code}
            console.log(paramBody)
            await targetUser.set(paramBody).save()
            res.send({success:true,message:'email successfully sent!'})
        }
    })
}
router.post('/forgetPassword',async (req,res)=>{
    sendCodeToEmail('forgetPassword',req,res)
})
router.post('/verify',async (req,res)=>{
    if(typeof req.body.code == 'string'){
        if(!Helper.validateFields(req,res,{email:'String',code:'String'}))
            return
        const code = req.body.code 
        const email = req.body.email   
        const target = await User.findOne({email:email,emailConfirmationCode:code})
        if(!target)
            res.send({fieldError:true,message:'the user does not exist'})
        else{
            await target.set({isEmailConfirmed:true,emailConfirmationCode:undefined}).save()
            Helper.sendJWTAuthenticationCookie(res,email,target.firstName).send({confirmSuccess:true})    
        }
    }else
        sendCodeToEmail('emailConfirm',req,res)
})

router.put('/forgetPassword/:code',async (req,res)=>{
     const targetUser = await User.findOne({forgetPasswordCode:req.params.code})
     if(req.body.editPassword){
        if(!targetUser) 
            return res.send({forgetPasswordPing : true, userExist:false})
        if(!Helper.validateFields(req,res,{password:'String',confirmPassword:'String'}))
            return
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        if(password != confirmPassword)
            return Helper.fieldError(res,'password and confirm password should be same',['password','confirmPassword'])
        await targetUser.set({forgetPasswordCode:undefined,password:password}).save()   
        res.send({passwordChanged:true})
     }else{
         if(targetUser)
            res.send({forgetPasswordPing : true, userExist:true})
         else
            res.send({forgetPasswordPing : true, userExist:false})   
     }
})


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
        if (!Helper.validateFields(req,res,{email:'String',password:'String'}))
            return
        user = await User.findOne({email:email,password:password})
    }
    if(user){
        if(!user.isActive)
            return Helper.reportAccountDeactivated(res,true)
        const blockedIP = BlockedIP.findOne({ip:req.ip})
        if(blockedIP){
            await blockedIP.deleteOne()
        }
        if(!user.isEmailConfirmed){
            return res.send({requiredToConfirm:true})
        }
        await user.set({isLogged:true}).save()
        Helper.sendJWTAuthenticationCookie(res,user.email,user.firstName)
        .send({authorize:true,message:'you are authenticated',userName:user.firstName})
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
        return Helper.invalidToken(res,'not valid token to sign out')
    }
    
    const loggedUser = await User.findOne({email:data.email})
    if(!loggedUser){
        return res.status(400).send({error:true,message:'not a valid user'})
    }
    await loggedUser.set({isLogged:false}).save()
    return res.send({signOut:true,email:data.email})
})
module.exports = router
const router = require('express').Router()
const nodeMailer = require('nodemailer')
const constants = require('../../constants')
const User = require('../../models/User')
const helper = require('../helper')
const Helper = require('../helper')
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
        return helper.fieldError(res,'email does not exist',['email'])
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
        if(!helper.validateFields(req,res,{email:'String',code:'String'}))
            return
        const code = req.body.code 
        const email = req.body.email   
        const target = await User.findOne({email:email,emailConfirmationCode:code})
        if(!target)
            res.send({fieldError:true,message:'the user does not exist'})
        else{
            await target.set({isEmailConfirmed:true,emailConfirmationCode:undefined}).save()
            res.send({confirmSuccess:true})    
        }
    }else
        sendCodeToEmail('emailConfirm',req,res)
})

router.put('/forgetPassword/:code',async (req,res)=>{
     const targetUser = await User.findOne({forgetPasswordCode:req.params.code})
     if(req.body.editPassword){
        if(!targetUser) 
            return res.send({forgetPasswordPing : true, userExist:false})
        if(!helper.validateFields(req,res,{password:'String',confirmPassword:'String'}))
            return
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        if(password != confirmPassword)
            return helper.fieldError(res,'password and confirm password should be same',['password','confirmPassword'])
        await targetUser.set({forgetPasswordCode:undefined,password:password}).save()   
        res.send({passwordChanged:true})
     }else{
         if(targetUser)
            res.send({forgetPasswordPing : true, userExist:true})
         else
            res.send({forgetPasswordPing : true, userExist:false})   
     }
})

router.get('/',async (req,res)=>{
    const userList = await User.find()
    userList.map(acc => {
        var modifiedDetails = acc
        modifiedDetails.password = undefined
        return modifiedDetails
    })
    res.send({users:userList})
})
router.get('/:id',async (req,res)=>{
    if(!helper.isObjectIDValid(req.params.id))
        return res.status(400).send({error:true,message:'object ID is not valid'})
    const foundUser = await User.findById(req.params.id)
    if(foundUser)
        res.send({found:true,user:foundUser})
    else
        res.send({found:false})
})
router.put('/:id',async (req,res)=>{
    if(!helper.isObjectIDValid(req.params.id))
        return res.status(400).send({error:true,message:'object ID is not valid'})
    const foundUser = User.findById(req.params.id)
    if(foundUser)
        res.send({found:true,user:helper.trimPassword(user)})
    else
        res.send({updated:false})
})
router.post('/',async (req,res)=>{
    var mapping = {}
    var schemaPaths = User.schema.requiredPaths()
    for(const path of schemaPaths){
        let value = User.schema.paths[path]
        mapping[path] = value.instance
    }
    if(!Helper.validateFields(req,res,mapping))
        return
    if(req.body.password != req.body.confirmPassword){
        return Helper.fieldError(res,"password and confirm password mismatch",['password','confirmPassword'])
    }
    if(await User.findOne({email:req.body.email}))
        return helper.fieldError(res,`email address ${req.body.email} is already taken`,['email'])
    var newUser = await new User(Helper.mapRequestBodyToObject(req,Object.keys(mapping))).save()
    newUser = Helper.showFields(newUser,Object.keys(mapping),['password'])
    newUser.success = true
    res.send(newUser)
})

module.exports = router
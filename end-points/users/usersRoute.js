const router = require('express').Router()
const nodeMailer = require('nodemailer')
const constants = require('../../constants')
const User = require('../../models/User')
const Helper = require('../helper')
router.post('/forgetPassword',(req,res)=>{
    console.log({
        user:process.env.email,
        password:process.env.password
    })
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
    if(typeof req.body.email != 'string')
        return Helper.badRequest(res,'Please provide a valid email address')
    var emailOptions = {
        from:process.env.email,
        to:req.body.email
    }
    emailOptions = constants.designEmailContent('somthing_for_now',emailOptions)
    transporter.sendMail(emailOptions,(err,data)=>{
        if(err){
            res.send({success:false,message:err})
        }else{
            res.send({success:true,message:'email successfully sent!'})
        }
    })
})
router.post('/',async (req,res)=>{
    const fields = ['email','password','phoneNumber']
    if(!Helper.validateFields(req,res,{email:String,password:String,phoneNumber:String}))
        return
    var newUser = await new User(Helper.mapRequestBodyToObject(req,fields)).save()
    newUser = Helper.showFields(newUser,['email','phoneNumber'],['password'])
    res.send(newUser)
})

module.exports = router
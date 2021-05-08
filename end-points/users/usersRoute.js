const router = require('express').Router()
const nodeMailer = require('nodemailer')
const constants = require('../../constants')
const User = require('../../models/User')
const helper = require('../helper')
const Helper = require('../helper')
//const RandomCodeGenerator = require('crypto-random-string')
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
    emailOptions = constants.designEmailContent(RandomCodeGenerator({length: 10, type: 'url-safe'}),emailOptions)
    transporter.sendMail(emailOptions,(err,data)=>{
        if(err){
            res.send({success:false,message:err})
        }else{
            res.send({success:true,message:'email successfully sent!'})
        }
    })
})
router.get('/forgetPassword/:code',async (req,res)=>{
    // User.find
    // req.params.code
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
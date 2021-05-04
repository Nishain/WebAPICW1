const router = require('express').Router()
const nodeMailer = require('nodemailer')
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
    
    const emailOptions = {
        from:process.env.email,
        to:req.body.email,
        subject:'Quick photo forget password',
        text:'follow this link for forget password'
    }
    transporter.sendMail(emailOptions,(err,data)=>{
        if(err){
            res.send({success:false,message:err})
        }else{
            res.send({success:true,message:'email successfully sent!'})
        }
    })
})
router.post('auth',(req,res)=>{
    let email = req.body["email"]
    let password = req.body["password"]
    
    console.log(req.ip)
})
module.exports = router
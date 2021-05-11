const router = require('express').Router()
const constants = require('../../constants')
const User = require('../../models/User')
const helper = require('../helper')
const Helper = require('../helper')

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
    const isProviderEnabledAccount = typeof req.body.isProviderEnabledAccount == 'boolean' && req.body.isProviderEnabledAccount
    if(isProviderEnabledAccount){
        schemaPaths.push('quickSignInID')
    }else
        schemaPaths.push('password')
    for(const path of schemaPaths){
        let value = User.schema.paths[path]
        mapping[path] = value.instance
    }
    if(!Helper.validateFields(req,res,mapping))
        return
    if(!isProviderEnabledAccount && req.body.password != req.body.confirmPassword){
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
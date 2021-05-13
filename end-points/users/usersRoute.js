const router = require('express').Router()
const constants = require('../../constants')
const User = require('../../models/User')
const helper = require('../helper')
const Helper = require('../helper')
router.get('/',async (req,res)=>{
    if(!getUserType(req,undefined).admin)
        helper.accessDenyUser('outsider','only an admin can do this',res)
    const userList = await User.find()
    userList.map(acc => {
        return helper.trimSensitiveData(acc)
    })
    res.send({users:userList})
})
router.get('/:id',async (req,res)=>{
    if(!helper.isObjectIDValid(req.params.id))
        return res.status(400).send({error:true,message:'object ID is not valid'})
    const foundUser = await User.findById(req.params.id)
    if(getUserType(req,foundUser.email).outsider)
        return Helper.accessDenyUser('outsider','only admin or account owner can view their data',res)
    if(foundUser)
        res.send({found:true,user:helper.trimSensitiveData(foundUser)})
    else
        res.send({found:false})
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
        mapping[path] = value.instance //data type
    }
    if(!Helper.validateFields(req,res,mapping))
        return
    if(!isProviderEnabledAccount && req.body.password != req.body.confirmPassword){
        return Helper.fieldError(res,"password and confirm password mismatch",['password','confirmPassword'])
    }
    if(await User.findOne({email:req.body.email}))
        return helper.fieldError(res,`email address ${req.body.email} is already taken`,['email'])
    var modelBody = Helper.mapRequestBodyToObject(req,Object.keys(mapping))    
    if(typeof req.body.adminPermissionCode == 'string'){
        if(await User.findOne({adminPermissionCode:req.body.adminPermissionCode}))
            modelBody.isAdmin = true
    }    
    var newUser = await new User(modelBody).save()
    newUser = Helper.showFields(newUser,Object.keys(mapping),['password'])
    newUser.success = true
    newUser.isAdmin = modelBody.isAdmin || false
    res.send(newUser)
})
function getUserType(req,requestedUser){
    req.userEmail = 'nishain.atomic@gmail.com'
    req.isAdmin = true
    const loggedEmail = req.userEmail
    var userType
    if(requestedUser && requestedUser.email == loggedEmail){
        userType = 'owner'
        if(requestedUser.isAdmin)
            userType = 'adminOwner'
    }
    else if(req.isAdmin)
        userType = 'admin'
    else
        userType = 'outsider'      
    return {[userType] : true}     
}
router.put('/',async (req,res)=>{
    const query = req.body.query
    if(!query)
        return res.status(400).send({message : 'should provide a query'})
    const restrictedFieldsForAll = constants.userSensitiveFields
    const restrictedFieldsForAdmin = ['password']
    var restrictedFieldsForOwner = ['isActive','isEmailConfirmed','isAdmin'].concat(restrictedFieldsForAll)
    restrictedFieldsForOwner.splice(restrictedFieldsForOwner.indexOf('password'),1)
    console.log(`restrictedFieldsForOwner - ${restrictedFieldsForOwner}`)
    const user = await User.findOne(query)
    if(!user)
        return res.send({message : 'user does not exist'})
    const userType = getUserType(req,user)
    if(userType.outsider)
        return res.status(401).send({
            user : 'outsider',
            message:'only admin and account owner can access this endpoint'
        })
    if(userType.isAdmin && Helper.doesRequestBodyContainRestrictedFields(req,restrictedFieldsForAll))
        return res.status(401).send({
            user : 'admin',
            message : 'your body contain fields which are restricted to be edited'
        })
    if((userType.owner || userType.adminOwner) && 
        Helper.doesRequestBodyContainRestrictedFields(req,restrictedFieldsForOwner)){
            return res.status(401).send({
                user : 'owner',
                message : 'your body contain fields which are restricted to be edited'
            })
    }        
    var modelBody = Helper.mapRequestBodyToObject(req,undefined,['query'])
    var mapping = {}
    for(const path of Object.keys(modelBody)){
        let value = User.schema.paths[path]
        mapping[path] = value.instance //data type
    }
    if(!Helper.validateFields(req,res,mapping))
        return  
    var updatedUser = await (user.set(modelBody)).save()
    res.send(helper.trimSensitiveData(updatedUser))
})
module.exports = router
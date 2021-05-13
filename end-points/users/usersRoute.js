const router = require('express').Router()
const constants = require('../../constants')
const User = require('../../models/User')
const helper = require('../helper')
const Helper = require('../helper')
const jwt = require('jsonwebtoken')
const RandomCodeGenerator = require('randomatic')
router.get('/',async (req,res)=>{
    if(!getUserType(req,undefined).admin)
        helper.accessDenyUser('outsider','only an admin can do this',res)
    const userList = await User.find()
    userList.map(acc => {
        return helper.trimSensitiveData(acc)
    })
    res.send({users:userList})
})
async function getUserByGETParams(req,res){
    if(!['id','email'].includes(req.params.mode)){
        res.send({message : 'provide a valid mode'})
        return {exitEarly : true}
    }
    const mode = req.params.mode    
    var identifier = req.params.identifier

    if(mode == 'id' && !helper.isObjectIDValid(req.params.id)){
        res.status(400).send({error:true,message:'object ID is not valid'})
        return {exitEarly : true}
    }
    if(mode == 'email' && identifier == 'auto'){
        identifier = jwt.verify(req.cookies["jwt"].token, process.env.jwtSecret).email
    }
    const foundUser = await (mode=='email' ? User.findOne({email:identifier}) : User.findById(identifier))
    return foundUser
}
router.get('/:mode/:identifier',async (req,res)=>{
    const foundUser = await getUserByGETParams(req,res)
    if(getUserType(req,foundUser.email).outsider)
        return Helper.accessDenyUser('outsider','only admin or account owner can view their data',res)
    if(foundUser){
        if(foundUser.exitEarly)
            return
        res.send({found:true,user:helper.trimSensitiveData(foundUser)})
    }
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
        if(await User.findOne({adminPermissionCode:req.body.adminPermissionCode})){
            modelBody.isAdmin = true,
            adminPermissionCode = RandomCodeGenerator('Aa0',10)
        }
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
router.put('/:mode/:identifier',async (req,res)=>{
    const restrictedFieldsForAll = constants.userSensitiveFields//quickSignInID
    var restrictedFieldsForOwner = ['isActive','isEmailConfirmed','isAdmin'].concat(restrictedFieldsForAll)
    restrictedFieldsForOwner.splice(restrictedFieldsForOwner.indexOf('password'),1) // remove password field from restriction
    const user = await getUserByGETParams(req,res)
    if(!user)
        return res.send({message : 'user does not exist'})
     if(user.exitEarly)
        return   
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
    var modelBody = Helper.mapRequestBodyToObject(req,undefined)
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
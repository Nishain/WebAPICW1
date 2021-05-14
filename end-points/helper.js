const Mongoose = require('mongoose')
const constants = require('../constants')
const jwt = require('jsonwebtoken')
const randomatic = require('randomatic')
class Helper {
    validateFields(req,res,structure){
        let emptyFields = this.checkIfEmpty(req,Object.keys(structure))
        if(emptyFields){
            this.fieldError(res,`Some fields are empty`,emptyFields)
            return false
        }
        let invalidFields = this.checkFormat(req,structure) 
        if(invalidFields){
            this.fieldError(res,`Some fields are in invalid format`,invalidFields)
            return false
        }
        let invalidField = this.checkRegexValidation(Object.keys(structure),req)
        if(invalidField){
            this.fieldError(res,invalidField.message,[invalidField.field])
            return false
        }
        let invalidEnumField = this.checkEnums(Object.keys(structure),req)
        if(invalidEnumField){
            this.fieldError(res,invalidEnumField.message,[invalidEnumField.field])
            return false
        }
        return true
    }
    notFound(res){
        return res.status(404).send({notFound:true,error:'the requested resource not found!'})
    }
    
    showFields(object,includes,except){
        var result = {}
        for(const field in object){
            if(includes.includes(field) && !except.includes(field)){
                result[field] = object[field]
            }
        }
        return result
    }
    trimPassword (object){
        object.password = undefined
        object.Password = undefined
        return object
    }
    mapRequestBodyToObject (req,fields=undefined,notInclude){
        var obj = {}
        for(const key in req.body){
            if((notInclude == undefined || !notInclude.includes(key)) && (fields == undefined || fields.includes(key)))
            obj[key] = req.body[key]
        }
        return obj
    }
    checkEnums(fieldnames,req){
        var invalidField = undefined
        var enumData = undefined
        for(const field of fieldnames){
         enumData =  constants.default.enums[field.toLowerCase()]
            if(!enumData)
                continue
            if(!enumData.includes(req.body[field])){
                invalidField = field
                break
            }
        }
        if(invalidField)
            return {
                message: `field ${invalidField} should contain a value within enum [${enumData.join(',')}]`,
                field : invalidField
            }
        return false
    }
    checkRegexValidation(fieldnames,req){
        var invalidFields = []
        for(const field of fieldnames){
            if(constants.regexMapping[field.toLowerCase()]){
                if(constants.regexMapping[field.toLowerCase()].regex.test(req.body[field]))
                    return false
                else
                    return {
                        field:field,
                        message:constants.regexMapping[field.toLowerCase()].message
                    }    
            } 
                
        }
        if(invalidFields.length > 0)
            return invalidFields
        return false    
    }
    isCastableToNumber(value,fieldType){
        if(fieldType.toLowerCase() == 'number'){
            if(isNaN(value))
                return false
            else
                return true    
        }else
            return false
    }
    doesRequestBodyContainRestrictedFields(req,restrictedFields){
        const keys = Object.keys(req.body)
        for(const field of restrictedFields){
            if(keys.includes(field))
                return true
        }
        return false
    }
    trimSensitiveData(obj){
        var newObj = obj
        const removingFields = ['forgetPasswordCode','password','quickSignInID','hashSalt','emailConfirmationCode']
        for(const removeField of removingFields){
            newObj[removeField] = undefined
        }
        return newObj
    }
    setUserSignUpMethod(acc){
        var newObj = acc
        if(typeof acc.quickSignInID == 'string' && typeof acc.password == 'string'){
            newObj['signUpMode'] = 'undetermined' //very rare case
            return newObj
        }
        if(typeof acc.quickSignInID == 'string'){
            newObj['signUpMode'] = 'thirdParty'
        }
        else{
            newObj['signUpMode'] = 'normal'
        }
        return newObj        
    }
    clone(obj){
        var newObj = {}
        for(const key in obj){
            newObj[key] = obj[key]
        }
        return newObj
    }
    getSessionCode(){
        return randomatic('Aa0',15)
    }
    sendJWTAuthenticationCookie(res,user,username){
        res.cookie('jwt',{
            token:jwt.sign({email:user.email,sessionCode : user.sessionCode},
            process.env.jwtSecret,//secret
            {expiresIn:'1h'}),
            username:username
        })
        return res
    }
    checkFormat(req,structure){
        var invalidFields = []
        for(const field in structure){
            let isTypeMatched = 
            this.isCastableToNumber(req.body[field],structure[field]) 
            || typeof req.body[field] == structure[field].toLowerCase()
            if((typeof req.body[field] == "undefined") || !isTypeMatched){
                invalidFields.push(field)
            }
        }
        if(invalidFields.length > 0)
            return invalidFields
        return false    
    }
    checkIfEmpty (req,fields){
        var emptyFields = []
        for(let field of fields){
            if(typeof req.body[field] == 'undefined' || req.body[field] == '')
                emptyFields.push(field)
        }
        if(emptyFields.length > 0)
            return emptyFields
        return false
    }
    fieldError(res,msg,affectedFields){
        return res.status(400).send({
            fieldError:true,
            msg:msg,
            fields:affectedFields
        })
    }
    invalidToken(res,msg){
        res.status(401).send({invalidToken:true,message:msg})
    }
    isObjectIDValid(id){
        return Mongoose.Types.ObjectId.isValid(id)
    }
    badRequest(res,msg){
        return res.status(400).send({error:true,msg:msg})
    }
    reportAccountDeactivated(res,duringLogin = false){
        res.status(401).send({accountInActive:true,onlogin:duringLogin})
    }
    
    accessDenyUser(userType,msg,res){
        return res.status(401).send({
            user : userType,
            message : msg
        })
    }
}
module.exports = new Helper()
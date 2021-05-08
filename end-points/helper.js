const constants = require('../constants')
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
        return true
    }
    notFound(res){
        return res.status(404).send({error:'the requested resource not found!'})
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
    mapRequestBodyToObject (req,fields=undefined){
        var obj = {}
        for(const key in req.body){
            if(fields == undefined || fields.includes(key))
            obj[key] = req.body[key]
        }
        return obj
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
    badRequest(res,msg){
        return res.status(400).send({error:true,msg:msg})
    }
}
module.exports = new Helper()
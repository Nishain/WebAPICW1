class Helper {
    validateFields(req,res,structure){
        let emptyFields = this.checkIfEmpty(req,Object.keys(structure))
        if(emptyFields){
            this.badRequest(res,`Some fields are empty - [${emptyFields.join(',')}]`)
            return false
        }
        let invalidFields = this.checkFormat(req,structure)
        if(invalidFields){
            this.badRequest(res,`Some fields are in invalid format - [${invalidFields.join(',')}]`)
            return false
        }
        return true
    }
    notFound(res){
        return res.status(404).send({error:'the requested resource not found!'})
    }
    showFields(object,fields,except){
        var result = {}
        for(const field in object){
            if(fields.includes(field) && !except.includes(field))
                result[field] = object[field]
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
    checkFormat  (req,structure){
        var invalidFields = []
        for(const field in structure){

            let isTypeMatched = typeof req.body[field] == structure[field].name.toLowerCase()
            if((typeof req.body[field] == "undefined") || !isTypeMatched){
                console.log('should pushed')
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
            if(typeof req.body[field] == 'undefined')
                emptyFields.push(field)
        }
        if(emptyFields.length > 0)
            return emptyFields
        return false
    }
    badRequest(res,msg){
        return res.status(400).send({error:true,msg:msg})
    }
}
module.exports = new Helper()
const User = require('../models/User')
module.exports = {
    notFound : (res)=>{
        return res.status(404).send({error:'the requested resource not found1'})
    },
    mapRequestBodyToObject : (req)=>{
        var obj = {}
        for(key in req.body){
            obj[key] = req.body[key]
        }
        return obj
    },
    checkFormat = (req,model)=>{
        User.schema.eachPath()
    },
    checkIfEmpty = (req,fields)=>{
        var emptyFields = []
        for(let field of fields){
            if(typeof req.body[field] == 'undefined')
                emptyFields.push(field)
        }
        if(emptyFields.length > 0)
            return emptyFields
        return false
    },
    badRequest : (res,msg)=>{
        return res.send({error:true,msg:msg})
    }
}
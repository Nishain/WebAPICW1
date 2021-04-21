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
    badRequest : ()=>{
        return res.send({error:true,msg:msg})
    }
}
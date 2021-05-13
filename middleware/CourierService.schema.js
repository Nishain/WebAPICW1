  
const joi = require("@hapi/joi");

const schema = {
    courierService: joi.object({
        id: joi.number().max(100).required(),
        districtName: joi.string().max(100).required(),
        value: joi.string().pattern(/^[1-9]\d*(\.\d+)?$/).max(100).required(),
        CourierServiceName: joi.string().max(100).required(),
       
    })
};

module.exports = schema;
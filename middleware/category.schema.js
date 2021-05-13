  
const joi = require("@hapi/joi");

const schema = {
    category: joi.object({
        categoryName: joi.string().max(100).required(),
        price: joi.string().pattern(/^[1-9]\d*(\.\d+)?$/).max(100).required(),
       
    })
};

module.exports = schema;
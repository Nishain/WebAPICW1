const { courierService } = require("./CourierService.schema");

module.exports = {
    courierServiceValidation: async (req, res, next) => {
        const value = await courierService.validate(req.body);
        if (value.error) {
            res.status(400).json({
                success: 0,
                message: value.error.details[0].message
            })
        } else {
            next();
        }
    }
};
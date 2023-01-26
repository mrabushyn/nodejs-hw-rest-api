const Joi = require("joi");

const addUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().min(6).required(),
    subscription: Joi.string().valid("starter", "pro", "business"),
    token: Joi.string(),
});


module.exports = { addUserSchema };

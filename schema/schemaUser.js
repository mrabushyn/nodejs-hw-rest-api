const Joi = require("joi");

const addUserSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().min(6).required(),
    subscription: Joi.string(),
    token: Joi.string(),
});


module.exports = { addUserSchema };

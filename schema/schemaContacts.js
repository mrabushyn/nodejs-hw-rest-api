const Joi = require("joi");

    const addContactSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(10).required(),
        phone: Joi.number().min(8).required(),
    });

    const updateContactSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(10).required(),
        phone: Joi.number().min(8).required(),
    });

module.exports = { addContactSchema, updateContactSchema };

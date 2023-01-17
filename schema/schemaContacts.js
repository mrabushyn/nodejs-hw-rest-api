const Joi = require("joi");

const addContactSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(10).required(),
    phone: Joi.string().min(8).required(),
    favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(10).required(),
    phone: Joi.string().min(8).required(),
    favorite: Joi.boolean(),
});

const updateStatusSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

module.exports = { addContactSchema, updateContactSchema, updateStatusSchema };

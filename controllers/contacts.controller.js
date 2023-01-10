const contactsDB = require("../models/contacts");
const { HttpError } = require("../helpers/index");
// const Joi = require("joi");


async function getContacts(req, res) {
    const { limit } = req.query;
    const contacts = await contactsDB.listContacts({ limit });
    res.json(contacts);
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return next(HttpError(404, "contact not found"));
    }
    return res.json(contact);
}

async function createContact(req, res, next) {
    const { name, email, phone } = req.body;

    // if (!name || !email || !phone) {
    //     return next(HttpError(400, "missing required name field"));
    // }

    // const schema = Joi.object({
    //     name: Joi.string().min(2).required(),
    //     email: Joi.string().min(10).required(),
    //     phone: Joi.number().min(8).required(),
    // });
    // const { error } = schema.validate(req.body);
    // if (error) {
    //     return next(HttpError(400, error.message));
    // }
    const newContact = await contactsDB.addContact(name, email, phone);
    return res.status(201).json(newContact);
}

async function delContact(req, res, next) {
    const { contactId } = req.params;

    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return next(HttpError(404, "contact not found"));
    }

    await contactsDB.removeContact(contactId);
    return res.status(200).json({ message: "contact deleted" });
}

async function changeContact(req, res, next) {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const id = contactId;
    const contact = { id, name, email, phone };

    const trueContact = await contactsDB.getById(contactId);
    if (!trueContact) {
        return next(HttpError(404, "contact not found"));
    }

    await contactsDB.updateContact(contact);
    return res.status(200).json(contact);
}

module.exports = {
    getContacts,
    getContact,
    createContact,
    delContact,
    changeContact,
};

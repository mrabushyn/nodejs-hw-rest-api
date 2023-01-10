const contactsDB = require("../models/contacts");
// const  {tryCatchWrapper}  = require("../../helpers/index");
// const Joi = require("joi")

async function getContacts(req, res) {
    const { limit } = req.query;
    const contacts = await contactsDB.listContacts({ limit });
    res.json(contacts);
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.json(contact);
}

async function createContact(req, res, next) {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: "missing required name field" });
    }
    const newContact = await contactsDB.addContact(name, email, phone);
    return res.status(201).json(newContact);
}

async function delContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return res.status(404).json({ message: "No contact" });
    }
    await contactsDB.removeContact(contactId);
    res.status(200).json({ message: "contact deleted" });
}

async function changeContact(req, res, next) {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return res.status(404).json({ message: "No contact" });
    }
    await contactsDB.updateContact(contactId, name, email, phone);
    res.status(200).json(contact);
}

// contactsRouter.get(
//     "/api/error",
//     tryCatchWrapper(async (req, res, next) => {
//         throw new Error("Something happened. It's not good.");
//     })
// );

module.exports = {
    getContacts,
    getContact,
    createContact,
    delContact,
    changeContact,
};

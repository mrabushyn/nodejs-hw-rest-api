const contactsDB = require("../models/contacts");
const { HttpError } = require("../helpers/index");

async function getContacts(req, res) {
    const contacts = await contactsDB.listContacts();
    res.json(contacts);
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return next(new HttpError(404, "contact not found"));
    }
    return res.json(contact);
}

async function createContact(req, res, next) {
    const { name, email, phone } = req.body;
    const newContact = await contactsDB.addContact(name, email, phone);
    return res.status(201).json(newContact);
}

async function delContact(req, res, next) {
    const { contactId } = req.params;

    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return next(new HttpError(404, "contact not found"));
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
        return next(new HttpError(404, "contact not found"));
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

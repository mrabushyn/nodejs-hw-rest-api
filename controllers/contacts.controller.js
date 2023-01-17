// const contactsDB = require("../models/contacts");
const { Contacts } = require("../models/contactsMongoDb");
const { HttpError } = require("../helpers/index");

async function getContacts(req, res) {
    const contacts = await Contacts.find({});
    res.json(contacts);
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await Contacts.findById(contactId);
    if (!contact) {
        return next(new HttpError(404, "contact not found"));
    }
    return res.json(contact);
}

async function createContact(req, res, next) {
    const { name, email, phone, favorite } = req.body;
    const newContact = await Contacts.create({
        name,
        email,
        phone,
        favorite,
    });
    return res.status(201).json(newContact);
}

async function delContact(req, res, next) {
    const { contactId } = req.params;

    const contact = await Contacts.findById(contactId);
    if (!contact) {
        return next(new HttpError(404, "contact not found"));
    }

    await Contacts.findByIdAndRemove(contactId);
    return res.status(200).json({ message: "contact deleted" });
}

async function changeContact(req, res, next) {
    const { contactId } = req.params;
    const trueContact = await Contacts.findById(contactId);
    if (!trueContact) {
        return next(new HttpError(404, "contact not found"));
    }

    const { name, email, phone, favorite } = req.body;
    const id = contactId;
    const contact = { id, name, email, phone, favorite };
    await Contacts.findByIdAndUpdate({ _id: contactId }, contact, {
        new: true,
    });
    return res.status(200).json(contact);
}

async function updateStatusContact(req, res, next) {
    const { contactId } = req.params;
    const trueContact = await Contacts.findById(contactId);
    if (!trueContact) {
        return next(new HttpError(404, "contact not found"));
    }

    const { name, email, phone, favorite } = req.body;
    const id = contactId;
    const contact = { id, name, email, phone, favorite };



    await Contacts.findByIdAndUpdate({ _id: contactId }, contact, {
        new: true,
    });
    return res.status(200).json(contact);
}

module.exports = {
    getContacts,
    getContact,
    updateStatusContact,
    createContact,
    delContact,
    changeContact,
};

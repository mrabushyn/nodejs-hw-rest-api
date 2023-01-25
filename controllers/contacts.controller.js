// const contactsDB = require("../models/contacts");
const { Contacts } = require("../models/contactsMongoDb");
const { HttpError } = require("../helpers/index");

async function getContacts(req, res) {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const myContacts = await Contacts.find()
        // .populate("owner", { _id: 1, name: 1 })
        .skip(skip)
        .limit(limit);
    return res.json(myContacts);
}

async function getContact(req, res, next) {
    const { contactId } = req.params;
    const contact = await Contacts.findById(contactId);
    if (!contact) {
        return next(new HttpError(404, "contact not found"));
    }
    return res.json(contact);
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
    const updatedContact = await Contacts.findById(contactId);

    return res.status(200).json(updatedContact);
}

async function updateStatusContact(req, res, next) {
    const { contactId } = req.params;
    const trueContact = await Contacts.findById(contactId);
    if (!trueContact) {
        return next(new HttpError(404, "contact not found"));
    }

    const { favorite } = req.body;
    await Contacts.findByIdAndUpdate(
        { _id: contactId },
        { favorite },
        { new: true }
    );
    const updatedContact = await Contacts.findById(contactId);

    return res.status(200).json(updatedContact);
}

module.exports = {
    getContacts,
    getContact,
    updateStatusContact,
    delContact,
    changeContact,
};

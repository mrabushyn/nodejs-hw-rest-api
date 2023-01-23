// const contactsDB = require("../models/contacts");
const { Contacts } = require("../models/contactsMongoDb");
const { HttpError } = require("../helpers/index");

async function getContacts(req, res) {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contacts.find({}).skip(skip).limit(limit);
    return res.json(contacts);
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

// async function createContact(req, res, next) {
//     const { user } = req;
//     const { id: contactId } = req.body;

//     user.contacts.push(contactId);
//     await User.findByIdAndUpdate(user._id, user);
//     return res.status(201).json({
//         data: {
//             contacts: user.contacts,
//         },
//     });
// }

module.exports = {
    getContacts,
    getContact,
    updateStatusContact,
    createContact,
    delContact,
    changeContact,
};

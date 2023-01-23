const { User } = require("../models/userMongoDb");
// const { HttpError } = require("../helpers/index");
// const jwt = require("jsonwebtoken");

async function createContact(req, res, next) {
    const {user} =req
    const {id: contactId} = req.body
console.log(user);
    user.contacts.push(contactId);
    await User.findByIdAndUpdate(user._id, user)
    return res.status(201).json({ data: {
        contacts: user.contacts
    } });
}

async function getContacts(req, res, next) {
    const { user } = req;
    const { contacts } = user;

    return res.status(200).json({ data: { contacts } });
}

async function currentUser(req, res, next) {
    const { user } = req;
    return res.status(200).json({ data: { user } });
}

module.exports = {
    createContact,
    getContacts,
    currentUser,
};

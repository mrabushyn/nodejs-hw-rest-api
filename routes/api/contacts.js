const express = require("express");

const contactsRouter = express.Router();

const contactsDB = require("../../models/contacts.json");
// const  tryCatchWrapper  = require("../../helpers");

contactsRouter.get("/", async (req, res, next) => {
    res.json(contactsDB);
});

contactsRouter.get("/:contactId", async (req, res, next) => {
const {contactId} = req.params
const contact = contactsDB.find((contact) => (contact.id === contactId));
    res.json(contact);
});

contactsRouter.post("/", async (req, res, next) => {
    const newContact = {
        id: "11",
        name: "newContact",
        email: "newContact@egetlacus.ca",
        phone: "(294) 5555555555",
    };
    contactsDB.push(newContact);

    res.status(201).json(newContact);
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
    res.json(contactsDB);
});

contactsRouter.put("/:contactId", async (req, res, next) => {
    res.json(contactsDB);
});

// contactsRouter.get(
//     "/api/error",
//     tryCatchWrapper(async (req, res, next) => {
//         throw new Error("Something happened. It's not good.");
//     })
// );

module.exports = contactsRouter;

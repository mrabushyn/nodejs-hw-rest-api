const express = require("express");

const contactsRouter = express.Router();

const contactsDB = require("../../models/contacts.js");
// const  tryCatchWrapper  = require("../../helpers");

contactsRouter.get("/", async (req, res) => {
    const contacts = await contactsDB.listContacts();
    res.json(contacts);
});

contactsRouter.get("/:contactId", async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await contactsDB.getById(contactId);
    if (!contact) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.json(contact);
});

contactsRouter.post("/", async (req, res, next) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: "missing required name field" });
    }
    const newContact = await contactsDB.addContact(name, email, phone);
    return res.status(201).json(newContact);
});

// contactsRouter.delete("/:contactId", async (req, res, next) => {
//     res.json(contactsDB);
// });

// contactsRouter.put("/:contactId", async (req, res, next) => {
//     res.json(contactsDB);
// });

// contactsRouter.get(
//     "/api/error",
//     tryCatchWrapper(async (req, res, next) => {
//         throw new Error("Something happened. It's not good.");
//     })
// );

module.exports = contactsRouter;

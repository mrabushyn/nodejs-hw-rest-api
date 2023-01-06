const express = require("express");

const contactsRouter = express.Router();

const contactsDB = require("../../models/contacts.json");

contactsRouter.get("/", async (req, res, next) => {
    res.json(contactsDB);
});

contactsRouter.get("/:contactId", async (req, res, next) => {
    res.json(contactsDB);
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

module.exports = contactsRouter;

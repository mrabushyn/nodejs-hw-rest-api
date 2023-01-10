const express = require("express");

// const contactsDB = require("../../models/contacts.js");
const {
    getContact,
    getContacts,
    createContact,
    delContact,
    changeContact,
} = require("../../controllers/contacts.controller.js");
// const { tryCatchWrapper } = require("../../helpers/index.js");

const contactsRouter = express.Router();

contactsRouter.get("/", getContacts);

contactsRouter.get("/:contactId", getContact );

contactsRouter.post("/", createContact );

contactsRouter.delete("/:contactId", delContact );

contactsRouter.put("/:contactId", changeContact );

// contactsRouter.get(
//     "/api/error",
//     tryCatchWrapper(async (req, res, next) => {
//         throw new Error("Something happened. It's not good.");
//     })
// );

module.exports = contactsRouter;

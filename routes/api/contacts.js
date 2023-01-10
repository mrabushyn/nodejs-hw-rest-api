const express = require("express");
const {
    getContact,
    getContacts,
    createContact,
    delContact,
    changeContact,
} = require("../../controllers/contacts.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares/index");
const  addContactSchema  = require("../../schema/schemaContacts");

const contactsRouter = express.Router();

contactsRouter.get("/", tryCatchWrapper(getContacts));
contactsRouter.get("/:contactId", tryCatchWrapper(getContact));
contactsRouter.post(
    "/",
    validateBody(addContactSchema),
    tryCatchWrapper(createContact)
);
contactsRouter.put("/:contactId", tryCatchWrapper(changeContact));
contactsRouter.delete("/:contactId", tryCatchWrapper(delContact));

module.exports = contactsRouter;

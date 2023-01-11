const express = require("express");
const contactsRouter = express.Router();

const {
    getContact,
    getContacts,
    createContact,
    delContact,
    changeContact,
} = require("../../controllers/contacts.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares/index");
const {
    addContactSchema,
    updateContactSchema,
} = require("../../schema/schemaContacts");



contactsRouter.get("/", tryCatchWrapper(getContacts));
contactsRouter.get("/:contactId", tryCatchWrapper(getContact));
contactsRouter.post(
    "/",
    validateBody(addContactSchema),
    tryCatchWrapper(createContact)
);
contactsRouter.put(
    "/:contactId",
    validateBody(updateContactSchema),
    tryCatchWrapper(changeContact)
);
contactsRouter.delete("/:contactId", tryCatchWrapper(delContact));



module.exports = contactsRouter;

const express = require("express");
const contactsRouter = express.Router();

const {
    getContact,
    updateStatusContact,
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
    updateStatusSchema,
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

contactsRouter.patch(
    "/:contactId/favorite",
    validateBody(updateStatusSchema),
    tryCatchWrapper(updateStatusContact)
);

contactsRouter.delete("/:contactId", tryCatchWrapper(delContact));

module.exports = contactsRouter;

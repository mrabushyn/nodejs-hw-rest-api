const express = require('express');
const contactsRouter = express.Router();

const { auth } = require('../../middlewares/index');
const { tryCatchWrapper } = require('../../helpers/index');
const { validateBody } = require('../../middlewares/index');
const { updateContactSchema, updateStatusSchema } = require('../../schema/schemaContacts');
const {
    getContact,
    updateStatusContact,
    getContacts,
    delContact,
    changeContact,
} = require('../../controllers/contacts.controller');

contactsRouter.get('/', tryCatchWrapper(auth), tryCatchWrapper(getContacts));
contactsRouter.get('/:contactId', tryCatchWrapper(auth), tryCatchWrapper(getContact));
contactsRouter.put(
    '/:contactId',
    tryCatchWrapper(auth),
    validateBody(updateContactSchema),
    tryCatchWrapper(changeContact)
);
contactsRouter.patch(
    '/:contactId/favorite',
    tryCatchWrapper(auth),
    validateBody(updateStatusSchema),
    tryCatchWrapper(updateStatusContact)
);

contactsRouter.delete('/:contactId', tryCatchWrapper(auth), tryCatchWrapper(delContact));

module.exports = contactsRouter;

const express = require('express');
const userRouter = express.Router();

const {
    register,
    login,
    logout,
    createContact,
    getCurrentUserContacts,
    currentUser,
    updateUserSubscription,
    uploadAvatar,
} = require('../../controllers/user.controller');
const { auth, validateBody, upload } = require('../../middlewares/index');
const { addContactSchema } = require('../../schema/schemaContacts');
const { addUserSchema } = require('../../schema/schemaUser');
const { tryCatchWrapper } = require('../../helpers/index');

userRouter.post(
    '/register',
    validateBody(addUserSchema),
    tryCatchWrapper(register)
);
userRouter.post('/login', validateBody(addUserSchema), tryCatchWrapper(login));
userRouter.post('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
userRouter.post(
    '/contacts',
    tryCatchWrapper(auth),
    validateBody(addContactSchema),
    tryCatchWrapper(createContact)
);
userRouter.patch(
    '/',
    tryCatchWrapper(auth),
    validateBody(addUserSchema),
    tryCatchWrapper(updateUserSubscription)
);
userRouter.get(
    '/contacts',
    tryCatchWrapper(auth),
    tryCatchWrapper(getCurrentUserContacts)
);
userRouter.get('/current', tryCatchWrapper(auth), tryCatchWrapper(currentUser));
userRouter.patch(
    '/avatars',
    tryCatchWrapper(auth),
    upload.single('avatar'),
    tryCatchWrapper(uploadAvatar)
);

module.exports = userRouter;

const express = require("express");

const {
    createContact,
    getContacts,
    currentUser,
} = require("../../controllers/user.controller");

const { tryCatchWrapper } = require("../../helpers/index");

const { auth } = require("../../middlewares/index");

// const { addUserSchema } = require("../../schema/schemaUser");

const userRouter = express.Router();

userRouter.post("/contacts", tryCatchWrapper(auth), tryCatchWrapper(createContact));
userRouter.get("/contacts",tryCatchWrapper(auth), tryCatchWrapper(getContacts));
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = userRouter;
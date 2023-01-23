const express = require("express");

const { register, login } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares/index");
const { addUserSchema } = require("../../schema/schemaUser");

const authRouter = express.Router();

authRouter.post(
    "/register",
    validateBody(addUserSchema),
    tryCatchWrapper(register)
);
authRouter.post(
    "/login",
    // validateBody(addUserSchema),
    tryCatchWrapper(login)
);

module.exports = authRouter;
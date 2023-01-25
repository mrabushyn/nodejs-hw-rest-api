const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userMongoDb");

function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new HttpError(400, error.message));
        }
        return next();
    };
}

async function auth(req, res, next) {
    const authHeaders = req.headers.authorization || "";
    // console.log("req.heders:", authHeaders);
    const [type, token] = authHeaders.split(" ");

    if (type !== "Bearer") {
        throw new HttpError(401, "token type is not valid");
    }

    if (!token) {
        throw new HttpError(401, "no token provided");
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);
        req.user = user;
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            throw new HttpError(401, "jwt token is not valid");
        }
        throw error;
    }

    next();
}

module.exports = {
    validateBody,
    auth,
};

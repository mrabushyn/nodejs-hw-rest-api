const { HttpError } = require('../helpers');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userMongoDb');
const multer = require('multer');
const path = require('path');

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
    const authHeaders = req.headers.authorization || '';
    const [type, token] = authHeaders.split(' ');
    if (type !== 'Bearer') {
        throw new HttpError(401, 'Not authorized');
    }
    if (!token) {
        throw new HttpError(401, 'Not authorized');
    }
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);
        req.user = user;
    } catch (error) {
        if (
            error.name === 'TokenExpiredError' ||
            error.name === 'JsonWebTokenError'
        ) {
            throw new HttpError(401, 'Not authorized');
        }
        throw error;
    }

    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../tmp'));
    },
    filename: function (req, file, cb) {
        cb(null, Math.random() + file.originalname);
    },
});

const upload = multer({
    storage,
    // limits: {},
});

module.exports = {
    validateBody,
    auth,
    upload,
};

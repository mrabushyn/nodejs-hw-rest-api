const { Contacts } = require("../models/contactsMongoDb");
const { User } = require("../models/userMongoDb");
const { HttpError } = require("../helpers/index");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const bcrypt = require("bcrypt");



async function register(req, res, next) {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const savedUser = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            data: {
                user: {
                    email,
                    id: savedUser._id,
                },
            },
        });
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            return next(
                new HttpError(409, "User with this email already exists")
            );
        }
        return error.message;
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    const storedUser = await User.findOne({
        email,
    });

    if (!storedUser) {
        throw new HttpError(401, "email is not valid");
    }
    if (!password) {
        throw new HttpError(400, "password is require");
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
        throw new HttpError(401, "password is not valid");
    }

    const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
        expiresIn: "5h",
    });

    return res.status(200).json({
        data: {
            token,
        },
    });
}

async function createContact(req, res, next) {
    const { name, email, phone, favorite } = req.body;
    const { user } = req;
    const newContact = await Contacts.create({
        owner: user._id,
        name,
        email,
        phone,
        favorite,
    });
    return res.status(201).json(newContact);
}

async function getCurrentUserContacts(req, res, next) {
    const { limit = 20, page = 1 } = req.query;
    const { user } = req;
    const skip = (page - 1) * limit;
    const myContacts = await Contacts.find({ owner: user._id })
        .populate("owner", { _id: 1, name: 1 })
        .skip(skip)
        .limit(limit);
    return res.json(myContacts);
}

async function currentUser(req, res, next) {
    const { user } = req;
    return res.status(200).json({ data: { user } });
}

module.exports = {
    register,
    login,
    createContact,
    getCurrentUserContacts,
    currentUser,
};

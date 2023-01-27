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
            user: {
                email: savedUser.email,
                subscription: savedUser.subscription,
            },
        });
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            return next(new HttpError(409, "Email in use"));
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
        throw new HttpError(401, "Email or password is wrong");
    }
    const isPasswordValid = await bcrypt.compare(password, storedUser.password);
    if (!isPasswordValid) {
        throw new HttpError(401, "Email or password is wrong");
    }
    const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
        expiresIn: "5h",
    });
    return res.status(200).json({
        data: {
            token,
            user: {
                email: storedUser.email,
                subscription: storedUser.subscription,
            },
        },
    });
}

async function logout(req, res, next) {
    const { user } = req;
    const storedUser = await User.findById(user._id);
    if (!storedUser) {
        throw new HttpError(401, "Not authorized");
    }
    req.headers.authorization = "";
    return res.status(204).json({});
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
    const { user } = req;
    const { limit = 20, page = 1, favorite = false } = req.query;
    const skip = (page - 1) * limit;
    let myContacts;
    if (favorite === false) {
        myContacts = await Contacts.find({ owner: user._id })
            .populate("owner", { _id: 1, name: 1 })
            .skip(skip)
            .limit(limit);
        return res.json(myContacts);
    }
    myContacts = await Contacts.find({
        owner: user._id,
        favorite: true,
    })
        .populate("owner", { _id: 1, name: 1 })
        .skip(skip)
        .limit(limit);
    return res.json(myContacts);
}

async function currentUser(req, res, next) {
    const { user } = req;
    if (!user) {
        throw new HttpError(401, "Not authorized");
    }
    return res.status(200).json({
        data: {
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        },
    });
}

async function updateUserSubscription(req, res, next) {
    const { user } = req;
    if (!user) {
        throw new HttpError(401, "Not authorized");
    }
    const { subscription } = req.body;
    if (!subscription) {
        throw new HttpError(
            401,
            `Сhoose a subscription ('starter', 'pro' or 'business'). Now your subscription is - "${user.subscription}"`
        );
    }
    const updatedContact = await User.findByIdAndUpdate(
        { _id: user._id },
        { subscription },
        { new: true }
    );
    return res.status(200).json({
        data: {
            user: {
                email: updatedContact.email,
                subscription: updatedContact.subscription,
            },
        },
    });
}

module.exports = {
    register,
    login,
    logout,
    createContact,
    getCurrentUserContacts,
    currentUser,
    updateUserSubscription,
};

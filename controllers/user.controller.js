const { JWT_SECRET } = process.env;
const { Contacts } = require('../models/contactsMongoDb');
const { User } = require('../models/userMongoDb');
const { HttpError, sendMail } = require('../helpers/index');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

async function register(req, res, next) {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = v4();
    try {
        req.body.avatarURL = gravatar.url(email);
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: req.body.avatarURL,
            verificationToken,
        });
        await sendMail({
            to: email,
            subject: 'Please confirm your email',
            html: `<button> <a href="localhost:3000/api/users/verify/${verificationToken}"> Confirm email</a> </button>`,
        });
        res.status(201).json({
            user: {
                email: savedUser.email,
                subscription: savedUser.subscription,
                avatarURL: savedUser.avatarURL,
            },
        });
    } catch (error) {
        if (error.message.includes('E11000 duplicate key error')) {
            return next(new HttpError(409, 'Email in use'));
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
        throw new HttpError(401, 'Email or password is wrong');
    }
    if (!storedUser.verify) {
        throw new HttpError(401, ' We send you a letter to confirm your email');
    }
    const isPasswordValid = await bcrypt.compare(password, storedUser.password);
    if (!isPasswordValid) {
        throw new HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
        expiresIn: '1d',
    });

    await User.findByIdAndUpdate(storedUser._id, { token: token }, { new: true });
    return res.status(200).json({
        token,
        user: {
            email: storedUser.email,
            subscription: storedUser.subscription,
        },
    });
}

async function logout(req, res, next) {
    const { user } = req;
    const storedUser = await User.findById(user._id);
    if (!storedUser) {
        throw new HttpError(401, 'Not authorized');
    }
    await User.findByIdAndUpdate(storedUser._id, { token: '' }, { new: true });
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
    const { limit = 20, page = 1, favorite } = req.query;
    const skip = (page - 1) * limit;
    let myContacts;
    if (favorite === 'false') {
        myContacts = await Contacts.find({
            owner: user._id,
            favorite: false,
        })
            .populate('owner', { _id: 1, name: 1 })
            .skip(skip)
            .limit(limit);
        return res.json(myContacts);
    }
    if (favorite === 'true') {
        myContacts = await Contacts.find({
            owner: user._id,
            favorite: true,
        })
            .populate('owner', { _id: 1, name: 1 })
            .skip(skip)
            .limit(limit);
        return res.json(myContacts);
    }
    myContacts = await Contacts.find({ owner: user._id })
        .populate('owner', { _id: 1, name: 1 })
        .skip(skip)
        .limit(limit);
    return res.json(myContacts);
}

async function currentUser(req, res, next) {
    const { user } = req;
    if (!user) {
        throw new HttpError(401, 'Not authorized');
    }
    return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
    });
}

async function updateUserSubscription(req, res, next) {
    const { user } = req;
    if (!user) {
        throw new HttpError(401, 'Not authorized');
    }
    const { subscription } = req.body;
    if (!subscription) {
        throw new HttpError(
            401,
            `Choose a subscription ('starter', 'pro' or 'business'). Now your subscription is - "${user.subscription}"`
        );
    }
    const updatedContact = await User.findByIdAndUpdate({ _id: user._id }, { subscription }, { new: true });
    return res.status(200).json({
        email: updatedContact.email,
        subscription: updatedContact.subscription,
    });
}

async function uploadAvatar(req, res, next) {
    const { filename, destination, originalname } = req.file;
    const { user } = req;
    const avatarIdName = user._id + '_' + originalname;
    const tmpPath = path.resolve(destination, filename);
    const publicPath = path.resolve(__dirname, '../public/avatars', avatarIdName);

    try {
        await Jimp.read(tmpPath).then(image => {
            image.resize(250, 250);
            image.quality(60);
            image.write(publicPath);
        });
        await fs.unlink(tmpPath);
    } catch (error) {
        await fs.unlink(tmpPath);
        throw new HttpError(400, 'Not authorized');
    }

    const avatarPath = `avatars/${avatarIdName}`;
    await User.findByIdAndUpdate(user._id, { avatarURL: avatarPath }, { new: true });
    return res.status(200).json({
        avatarURL: avatarPath,
    });
}

async function verifyEmail(req, res, next) {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null,
    });
    return res.status(200).json({ message: 'Verification successful' });
}

async function verify(req, res, next) {
    const { email } = req.body;

    if (!email || email === '') {
        throw new HttpError(400, 'missing required field email');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(404, 'Not found');
    }

    const verificationToken = v4();
    const verifyUser = await User.findByIdAndUpdate(user._id, { verificationToken }, { new: true });

    if (verifyUser.verify) {
        throw new HttpError(400, 'Verification has already been passed');
    }

    if (!verifyUser.verify) {
        await sendMail({
            to: email,
            subject: 'Please confirm your email',
            html: `<button> <a href="localhost:3000/api/users/verify/${verificationToken}"> Confirm email</a> </button>`,
        });
        throw new HttpError(401, ' We send you a letter to confirm your email');
    }
}

module.exports = {
    register,
    login,
    logout,
    createContact,
    getCurrentUserContacts,
    currentUser,
    updateUserSubscription,
    uploadAvatar,
    verifyEmail,
    verify,
};

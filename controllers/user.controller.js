const { Contacts } = require('../models/contactsMongoDb');
const { User } = require('../models/userMongoDb');
const { HttpError } = require('../helpers/index');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const { JWT_SECRET } = process.env;

const bcrypt = require('bcrypt');

async function register(req, res, next) {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        req.body.avatarURL = gravatar.url(email);
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: req.body.avatarURL,
        });
        // console.log(req.body.avatarURL);
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
    const isPasswordValid = await bcrypt.compare(password, storedUser.password);
    if (!isPasswordValid) {
        throw new HttpError(401, 'Email or password is wrong');
    }

    const token = jwt.sign({ id: storedUser._id }, JWT_SECRET, {
        expiresIn: '1d',
    });

    await User.findByIdAndUpdate(storedUser._id, { token: token }, { new: true });
    console.log(storedUser.token);
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
    await User.findByIdAndUpdate(storedUser._id, { token: "" }, { new: true });
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
            `Сhoose a subscription ('starter', 'pro' or 'business'). Now your subscription is - "${user.subscription}"`
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

    console.log(req.file);

    const tmpPath = path.resolve(destination, filename);
    const publicPath = path.resolve(__dirname, '../public/avatars', avatarIdName);
    try {
        await fs.rename(tmpPath, publicPath);
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

//   const { _id } = req.user;
//   const { path } = req.file;
//   req.body.avatarURL = gravatar.url(req.body.email);
//   await updateAvatar(_id, req.body.avatarURL);
//   try {
//     await copyAvatar(req.file, req.body);
//   } catch (error) {
//     await fs.unlink(path);
//     return next(error);
//   }
//   res.json({ avatarURL: req.body.avatarURL });
// };

module.exports = {
    register,
    login,
    logout,
    createContact,
    getCurrentUserContacts,
    currentUser,
    updateUserSubscription,
    uploadAvatar,
};

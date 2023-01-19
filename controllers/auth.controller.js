const { User } = require("../models/userMongoDb");
const { HttpError } = require("../helpers/index");
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

    return res.status(200).json({
        data: {
            token: "<TOKEN>",
        },
    });
}
module.exports = {
    register,
    login,
};

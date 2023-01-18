const { User } = require("../models/userMongoDb");
const { HttpError } = require("../helpers/index");
async function register(req, res, next) {
    const { email, password } = req.body;

    try {
        const savedUser = await User.create({
            email,
            password,
        });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error")) {
          throw new HttpError(409, "User with this email already exists");
      }
    }

    res.status(201).json({
        data: {
            user: savedUser,
        },
    });
}

module.exports = {
    register,
};

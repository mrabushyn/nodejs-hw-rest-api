const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
            minLength: [6, 'password should be at least 6 characters long'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/[a-z0-9]+@[a-z0-9]+/, 'user email is not valid!'],
        },
        subscription: {
            type: String,
            required: true,
            enum: ['starter', 'pro', 'business'],
            default: 'starter',
        },
        token: String,
        avatarURL: {
            type: String,
            default: '',
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model('user', userSchema);

module.exports = {
    User,
};

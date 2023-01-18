const mongoose = require("mongoose");

const contactsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Set email for contact"],
        },
        phone: {
            type: String,
            unique: true,
            required: [true, "Set phone for contact"],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
    }
);

const Contacts = mongoose.model("contact", contactsSchema);

module.exports = {
    Contacts,
};

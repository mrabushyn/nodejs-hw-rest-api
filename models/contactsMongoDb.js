const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Set name for contact"],
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    
},
  {
    versionKey: false,
  });

const Contacts = mongoose.model("contact", schema);

module.exports = {
    Contacts,
};

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email: {
        type: String,
        required: [true, "Please add your email address"],
        unique: [true, "Email is already registered"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);
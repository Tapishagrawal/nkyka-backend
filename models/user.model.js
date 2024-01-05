const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
    avatar: String,
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
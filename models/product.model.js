const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
    picture: { type: String, required: true },
    description: { type: String },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    category: { type: String, enum: ["Makeup", "Skincare", "Haircare"], required: true },
    price: { type: Number, required: true },
    userID: String,
    username: String,
}, {
    timestamps: true,
    versionKey: false
})

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel
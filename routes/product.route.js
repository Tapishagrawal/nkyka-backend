const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const ProductModel = require('../models/product.model');

const productRouter = express.Router();

productRouter.use(auth);

productRouter.get("/", async (req, res) => {
    let { category, gender, order, page, pageSize } = req.query;
    order = order === "asc" ? 1 : order === "desc" ? -1 : "";
    let sort;
    if (order) {
        sort = { price: order };
    } else {
        sort = {};
    }
    page = +page || 1;
    pageSize = +pageSize || 4;

    try {
        let query = { userID: req.body.userID };
        const totalProductsCount = await ProductModel.find(query).countDocuments();
        if (category && gender) {
            query = { ...query, gender, category };
        } else if (category) {
            query = { ...query, category };
        } else if (gender) {
            query = { ...query, gender };
        }

        const products = await ProductModel.find(query)
            .sort(sort)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return res.status(200).json({ status: "success", data: products, totalProducts: totalProductsCount });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
});
productRouter.get("/all", async (req, res) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({ status: "success", data: products });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
});

productRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findOne({ _id: id, userID: req.body.userID });

        if (product) {
            res.status(200).json({ status: "success", data: product });
        } else {
            res.status(404).json({ status: "fail", msg: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

productRouter.post("/add", async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        res.status(201).send({
            status: "success",
            message: "Product added",
            data: newProduct,
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
})

productRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findOne({ _id: id, userID: req.body.userID })
        if (product) {
            await ProductModel.findByIdAndUpdate({ _id: id }, req.body);
            const product = await ProductModel.findOne({ _id: id, userID: req.body.userID })
            res.status(200).send({
                status: "success",
                message: "Product has been updated",
                updatedProduct: product
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "Product not found",
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
})

productRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findOne({ _id: id, userID: req.body.userID })
        if (product) {
            await ProductModel.findByIdAndDelete({ _id: id });
            res.status(202).send({
                status: "success",
                message: "Product has been deleted",
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "Product not found",
            });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
})
module.exports = productRouter
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Rating = require("../models/rating");
const Comment = require("../models/comment");

const createProduct = async (info) => {
    try {
        return await Product.create({ ...info });
    } catch (err) {
        throw err;
    }
};

const findProduct = async (info) => {
    try {
        const { _id, search, category, features, brand, dir, order, priceMax, priceMin } = info;
        let filter = {};

        if (_id) filter._id = new mongoose.Types.ObjectId(`${_id}`);
        if (search) filter.productName = { $regex: search, $options: 'i' };
        if (category) filter.category = category;
        if (features) {
            filter.features = Array.isArray(features) ? { $all: features } : features;
        }
        if (brand) filter.brand = brand;

        let sort = {};
        if (order) {
            sort[order] = dir === 'desc' ? -1 : 1;
        }

        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = priceMin;
            if (priceMax) filter.price.$lte = priceMax;
        }

        return await Product.find(filter).sort(sort);
    } catch (err) {
        throw err;
    }
};

const deleteProduct = async (info) => {
    try {
        const { _id } = info;
        const objectId = mongoose.Types.ObjectId(`${_id}`);

        await Product.findByIdAndDelete(objectId);
        await Rating.deleteMany({ product: objectId });
        await Comment.deleteMany({ product: objectId });

        return { success: true };
    } catch (err) {
        throw err;
    }
};

const updateProduct = async (info, updateData) => {
    try {
        const { _id } = info;
        return await Product.findByIdAndUpdate(
            mongoose.Types.ObjectId(`${_id}`),
            updateData,
            { new: true, runValidators: true }
        );
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createProduct,
    findProduct,
    deleteProduct,
    updateProduct,
};

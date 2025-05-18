const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const { addIndex } = require("./indexService")
const {
    deleteRating
} = require("../services/ratingServices")
const { deleteComment } = require("../services/commentServices")
const Cart = require('../models/cart');
const cartServices = require('../services/cartServices');

const createProduct = async (info) => {
    try {
        if (info.brand || info.category) {
            await addIndex(info.brand, info.category)
        }
        return await Product.create({ ...info });

    } catch (err) {
        throw err;
    }
};
const pageInfo = async (info) => {
    const { _id, search, category, features, brand, dir, order, priceMax, priceMin, limit = 5 } = info;
    let filter = {};

    if (_id) filter._id = new mongoose.Types.ObjectId(`${_id}`);

    // if (search) filter.productName = { $regex: search, $options: 'i' };
    if (search) {
        filter.$or = [
            { productName: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { category: { $elemMatch: { $regex: search, $options: 'i' } } },
            { features: { $elemMatch: { $regex: search, $options: 'i' } } }
        ];
    }
    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (features) {
        if (Array.isArray(features)) {
            filter.features = {
                $all: features.map(f => new RegExp(`^${f}$`, 'i'))
            };
        } else {
            filter.features = { $regex: new RegExp(`^${features}$`, 'i') };
        }
    }

    if (brand) {
        filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    let sort = {};
    if (order) {
        if (order === "discount") {
            filter.discount = { $ne: 0 };
        }
        sort[order] = dir === 'desc' ? -1 : 1;

    }

    if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) filter.price.$gte = priceMin;
        if (priceMax) filter.price.$lte = priceMax;
    }
    const total = await Product.countDocuments(filter)
    return {
        total,
        totalPages: Math.ceil(total / limit),
    };
}

const findProduct = async (info) => {
    try {
        const { _id, search, category, features, brand, dir, order, priceMax, priceMin, page = 1, limit = 5 } = info;
        let filter = {};

        if (_id) filter._id = new mongoose.Types.ObjectId(`${_id}`);

        // if (search) filter.productName = { $regex: search, $options: 'i' };
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { category: { $elemMatch: { $regex: search, $options: 'i' } } },
                { features: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }
        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (features) {
            if (Array.isArray(features)) {
                filter.features = {
                    $all: features.map(f => new RegExp(`^${f}$`, 'i'))
                };
            } else {
                filter.features = { $regex: new RegExp(`^${features}$`, 'i') };
            }
        }

        if (brand) {
            filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
        }

        let sort = {};
        if (order) {
            if (order === "discount") {
                filter.discount = { $ne: 0 };
            }
            sort[order] = dir === 'desc' ? -1 : 1;

        }

        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = priceMin;
            if (priceMax) filter.price.$lte = priceMax;
        }



        return await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)

    } catch (err) {
        throw err;
    }
};

const deleteProduct = async (info) => {
    try {
        const { _id } = info;
        const objectId = new mongoose.Types.ObjectId(_id);
        const prod = await Product.findById(objectId);
        if (prod) {
            await deleteRating(objectId, "product")
            await deleteComment(objectId, "product")
            const carts = await Cart.find({ 'items.product': objectId });
            for (const cart in carts) {
                await cartServices.removeItem({ id: prod._id }, cart.user);
            }
        }
        else {
            throw new Error("Khong tim hoac khong xoa duoc san pham")
        }
        const productFound = await Product.findByIdAndDelete(objectId)
        return productFound;
    } catch (err) {
        throw err;
    }
};

const updateProduct = async (info, updateData) => {
    try {
        const { _id } = info;
        if (updateData.brand || updateData.category) {
            await addIndex(updateData.brand, updateData.category)
        }
        return await Product.findByIdAndUpdate(
            new mongoose.Types.ObjectId(`${_id}`),
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
    pageInfo
};

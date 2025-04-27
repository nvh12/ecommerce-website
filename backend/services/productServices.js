const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const {addIndex} = require("./indexService")
const {
    deleteRating
} = require("../services/ratingServices")
const {deleteComment} = require("../services/commentServices")
const createProduct = async (info) => {
    try {
        if (info.brand || info.category){
            await addIndex(info.brand,info.category)
        }
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
        const objectId =new  mongoose.Types.ObjectId(`${_id}`);

        const productFound = await Product.findByIdAndDelete(objectId)
        if(productFound){
            await deleteRating(objectId, "product")
            await deleteComment(objectId, "product")
        }
        else{
            throw new Error("Khong tim hoac khong xoa duoc san pham")
        }
        return productFound;
    } catch (err) {
        throw err;
    }
};

const updateProduct = async (info, updateData) => {
    try {
        const { _id } = info;
        if (updateData.brand || updateData.category){
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
};

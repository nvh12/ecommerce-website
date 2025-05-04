const mongoose = require('mongoose')
const {Brand, Category} = require('../models/index')
const Product = require('../models/product')

const addIndex = async (brand, category) => {
    try {
        if (brand) {
            try {
                await Brand.findOneAndUpdate(
                    { name: brand },
                    {}, // không update gì cả
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`Brand "${brand}" đã tồn tại (duplicate), bỏ qua.`);
                } else {
                    throw err;
                }
            }
        }

        if (category) {
            try {
                await Category.findOneAndUpdate(
                    { name: category },
                    {},
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`Category "${category}" đã tồn tại (duplicate), bỏ qua.`);
                } else {
                    throw err;
                }
            }
        }
    } catch (err) {
        console.error("Lỗi không xác định:", err);
    }
};

const findBrand = async () => {
    try {
        const brands = await Brand.find().sort({ name: 1 });

        // Lọc những brand nào có ít nhất 1 sản phẩm
        const filtered = [];
        for (const brand of brands) {
            const hasProduct = await Product.exists({ brand: brand.name });
            if (hasProduct) {
                filtered.push(brand);
            }
        }

        return filtered;
    } catch (err) {
        throw err;
    }
};

const findCategory = async () => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        const filtered = [];
        for (const category of categories) {
            const hasProduct = await Product.exists({ category: category.name }); // array contains
            if (hasProduct) {
                filtered.push(category);
            }
        }

        return filtered;
    } catch (err) {
        throw err;
    }
};


module.exports = {
    addIndex,
    findBrand,
    findCategory
}